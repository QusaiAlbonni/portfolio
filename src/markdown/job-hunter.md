# Telegram Job Finder Bot

A Telegram bot that **ingests posts from Telegram channels**, indexes them in **PostgreSQL**, and lets users **search** and **schedule digests** (daily/weekly/etc) for topics they care about.

It runs as a single FastAPI service:
- **FastAPI** hosts HTTP endpoints (Telegram webhook + admin UI).
- **Aiogram** handles bot updates (commands, callbacks, FSM flows).
- **Telethon** listens to channel posts and ingests them into the database.
- **APScheduler** delivers per-user digest jobs (stored in DB, leader-elected for multi-instance deployments).

---

## Features

- **Channel ingestion (Telethon)**
  - Listens to Telegram **channel-only** messages and ingests them into the DB.
  - **Allowlist gate**: messages are ignored unless the channel is allowlisted.
  - **Deduplication**:
    - SHA-256 hash on normalized text
    - Optional fuzzy duplicate detection for long messages

- **Search**
  - `/search` command prompts for a query and returns matched messages.
  - Plain text messages (no command) also trigger search when the user is not in a flow.
  - PostgreSQL-backed search (FTS `tsvector` + trigram index for normalized content).

- **Scheduled digests**
  - `/schedule` flow:
    - User enters a natural schedule (supports **English + Arabic** with AM/PM words)
    - User selects up to 5 topics
    - A per-user APScheduler Cron job is created/updated
  - If no results are found for the period, the bot sends a “no results” digest.

- **Topics & subscriptions**
  - Users subscribe to topics; digests and topic-based searches use those subscriptions.

- **Internationalization (i18n)**
  - `/language` command (English + Arabic shown in UI).
  - Fluentogram-based translation hub/middleware.

- **Admin panel**
  - Web admin under `/admin` (SQLAdmin) with authentication.
  - Manage allowlisted channels and topic/preset data (see `src/admin/`).

- **Production readiness**
  - **Webhook mode** (recommended in production) with secret header validation.
  - **Long polling mode** fallback when webhook URL is not provided.
  - **Sentry** integration.
  - Dockerfile + Fly.io config included.

---

## Tech stack

- **Language/runtime**: Python 3.12
- **Web**: FastAPI, Uvicorn, Starlette Sessions
- **Telegram**
  - Aiogram v3 (bot commands, callbacks, FSM)
  - Telethon (channel ingestion client)
- **Data**
  - PostgreSQL
  - SQLAlchemy 2 + SQLModel
  - Alembic migrations
  - Redis (Aiogram FSM storage)
- **Scheduling**: APScheduler (DB-backed job store)
- **Observability**: Sentry SDK
- **Packaging**: PDM (also has `requirements.txt` for compatibility)
- **Deployment**: Docker, Fly.io (`fly.toml`)

---

## Architecture (high level)

### Runtime components

- **FastAPI app** (`src/main.py`)
  - Starts/stops:
    - APScheduler
    - Aiogram bot (webhook or polling)
    - Telethon client (channel listener)
  - Mounts:
    - `/telegram/webhook` endpoint for Telegram updates
    - `/admin` admin UI

- **Aiogram bot** (`src/bot/`)
  - Routers for commands/callbacks/channel posts
  - Middlewares:
    - DB session injection
    - i18n injection
  - Redis-backed FSM storage

- **Telethon client** (`src/telethon_bot/`)
  - Listens to new channel posts and calls `services.channel_service.ingest_message(...)`

- **Database + migrations**
  - SQLModel models in `src/models/`
  - Alembic migrations in `src/migrations/`

- **Scheduler**
  - APScheduler AsyncIOScheduler with **SQLAlchemy job store** (jobs persisted in DB)
  - Leader election using **Postgres advisory locks** (so only one instance actively runs scheduled jobs)

### Data flow

1. Telethon receives a new channel message → `channel_service.ingest_message(...)`
2. Message is normalized → deduped → inserted → indexed for search
3. User searches (`/search` or plain text) → DB query using FTS/trigram
4. User schedules digest (`/schedule`) → CronTrigger created → APScheduler job stores schedule in DB
5. Scheduler triggers digest job → fetches topic matches → formats messages → sends to user

---

## Repository layout

- `src/main.py`: FastAPI app + lifespan startup/shutdown
- `src/api/`: FastAPI routes (Telegram webhook lives here)
- `src/bot/`: Aiogram bot (handlers, states, views, middlewares)
- `src/telethon_bot/`: Telethon client for ingesting channel posts
- `src/services/`: business logic (ingest, search, subscriptions, allowlist)
- `src/models/`: SQLModel models
- `src/schedular/`: APScheduler setup + tasks (digest jobs, locks, leader election)
- `src/admin/`: SQLAdmin views + auth
- `src/i18n/`: translations setup
- `src/migrations/`: Alembic migrations
- `run_migrations.py`: helper script to apply migrations
- `Dockerfile`, `entrypoint.sh`: container build/runtime
- `.env.example`: environment template

---

## Configuration

Copy `.env.example` to `.env` and fill values.

### Required environment variables

- **`DB_URL`**: sync SQLAlchemy URL (used for scheduler job store / sync engine)
  - Example: `postgresql://postgres:123@localhost:5432/example`
- **`ASYNC_DB_URL`**: async SQLAlchemy URL (used by app code)
  - Example: `postgresql+asyncpg://postgres:123@localhost:5432/example`
- **`TELEGRAM_BOT`**: Bot token from BotFather
- **`APP_ID`**, **`APP_HASH`**: Telethon API credentials from my.telegram.org

### Optional environment variables

- **`REDIS_URL`**: Redis connection string (Aiogram FSM storage)
  - If you run without Redis, the bot will fail to initialize dispatcher storage.
- **`TELEGRAM_BOT_WEBHOOK_URL`**: enables webhook mode (otherwise long polling)
  - Example: `https://your-domain.com/telegram/webhook`
- **`TELEGRAM_BOT_WEBHOOK_SECRET`**: required if webhook URL is set
  - Telegram sends it in `X-Telegram-Bot-Api-Secret-Token`
- **`JWT_SECRET`**, **`JWT_ALGORITHM`**: admin/session auth configuration
- **`SEARCH_PERIOD`**: hours to look back for text search (default: 24)
- **`BOT_NAME`**: bot display name used in i18n strings
- **`SENTRY_DSN`**: Sentry DSN (optional)
- **`TELE_SESSION_BASE64`**: (Docker) base64-encoded Telethon session file contents
  - On container start, `entrypoint.sh` restores it into `/app/anon.session`

---

## Running locally (Windows / PowerShell)

### 1) Create and configure environment

- Copy `.env.example` → `.env`
- Ensure Postgres and Redis are running

### 2) Install dependencies

Using PDM (recommended):

```bash
pdm install
```

Or with pip:

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

### 3) Run database migrations

This project includes Alembic migrations under `src/migrations/`.

There are two common ways to run them:

- **Using Alembic directly** (uses `alembic.ini`):

```bash
alembic -c alembic.ini upgrade head
```

- **Using the helper script** (`run_migrations.py`):
  - Note: this script expects **`DATABASE_URL`** (different name than `DB_URL`).

```bash
$env:DATABASE_URL="postgresql://postgres:123@localhost:5432/example"
python run_migrations.py
```

### 4) Start the service

```bash
uvicorn src.main:app --reload
```

The service will:
- start the scheduler
- start the bot (webhook mode if configured; otherwise polling)
- start Telethon channel ingestion

---

## Using the bot

### Commands

- **`/start`**: greet and initialize
- **`/language`**: choose language
- **`/search`**: prompt-based search flow
- **`/schedule`**: schedule digests (time + topics)

### Scheduling input examples

The scheduling parser supports **English and Arabic** day/time expressions and requires an AM/PM indicator.

Examples:
- `everyday 9 am`
- `monday 6 pm`
- `كل يوم ٩ ص`
- `الاثنين ٦ م`

---

## Admin UI

- URL: `http://localhost:8000/admin`
- Auth: configured via `JWT_SECRET` and the SQLAdmin auth backend
- Create an admin user via CLI (below), then sign in and manage:
  - allowlisted channels
  - presets/topics/keywords (depending on configured views)

---

## CLI (management commands)

The project includes a Typer CLI for user management (admin accounts for the admin UI).

Examples:

```bash
python -m src.cli.application create-admin
python -m src.cli.application create-user
python -m src.cli.application reset-password --username your_user
```

---

## Deployment

### Docker

Build:

```bash
docker build -t telegram-bot .
```

Run (example):

```bash
docker run --rm -p 8000:8000 --env-file .env telegram-bot
```

If you use Telethon in Docker, set `TELE_SESSION_BASE64` to restore `anon.session` at startup.

### Fly.io

This repo includes `fly.toml` configured to expose port 8000.
Typical flow:
- set secrets (`fly secrets set ...`)
- deploy (`fly deploy`)

---

## Notes / gotchas

- **Redis is required** for Aiogram FSM storage (`RedisStorage` is always used).
- **Webhook vs polling**:
  - Set `TELEGRAM_BOT_WEBHOOK_URL` (and secret) to use webhook mode.
  - Otherwise the bot uses long polling.
- **Migrations env var mismatch**:
  - App config uses `DB_URL` / `ASYNC_DB_URL`
  - `run_migrations.py` uses `DATABASE_URL`

---

## License

MIT (see `pyproject.toml`).

