# Chaters

**Chaters** is a real-time chat application designed for seamless communication across languages. Built with Django Channels, Vue.js, and Redis, it delivers high-performance asynchronous messaging with a focus on **context-aware translation**, ensuring users receive messages in their preferred language.

## Features

- **Real-time Communication:**  
  Leverages Django Channels and WebSockets for instant messaging between users.

- **Context-Aware Translation:**  
  Messages are automatically translated into the preferred language of each user. The translation AI understands the ongoing conversation and uses historical message data to provide more accurate and contextually relevant translations for new messages.

- **Modern Frontend:**  
  Built with Vue.js for a dynamic, responsive, and user-friendly interface.

- **Asynchronous Backend:**  
  Supports scalable and efficient real-time operations for large numbers of concurrent users.

- **Persistent Storage:**  
  Uses PostgreSQL for structured data and Backblaze B2 for media file storage.

- **Caching and Pub/Sub:**  
  Redis powers session management, caching, and Pub/Sub messaging to ensure real-time responsiveness.

## Tech Stack

| Component       | Technology                     |
|-----------------|--------------------------------|
| Backend         | Django Channels (WebSocket support) |
| Frontend        | Vue.js (SPA)                  |
| Database        | PostgreSQL                     |
| Cache/Message Queue | Redis                       |
| Storage         | Backblaze B2                   |

**Core Idea:** Chaters goes beyond standard messaging apps by integrating **intelligent, context-aware translation**. This means every message adapts to the conversation history and user preferences, enabling smoother cross-language communication in real-time.
