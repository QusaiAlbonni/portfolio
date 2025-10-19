import express, { Request, Response, NextFunction, Router } from "express";
import serverless from "serverless-http";
import { Resend } from "resend";
import { Handler } from "@netlify/functions";

const api = express();

api.use(express.json());

function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const allowedOrigin =
    process.env.SITE_URL || "https://qusayalbonniportfolio.netlify.app";
  const originHeader =
    (req.headers.origin as string) || (req.headers.referer as string) || "";

  if (originHeader.startsWith(allowedOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    return next();
  }

  return res.status(403).json({ error: "Forbidden" });
}

const router = Router();

router.use(corsMiddleware);


router.post("/contact", async (req: Request, res: Response) => {
  const { email, subject, message } = req.body ?? {};

  if (!email || !subject || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY in environment");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "albonniqusai@gmail.com",
      replyTo: String(email),
      subject: String(subject),
      html: `<p>You got a new message from ${String(email)}:</p><p>${String(
        message
      )}</p>`,
    });

    const id = result.data?.id ?? null;

    if (!id) throw new Error("Could not send email... something went wrong")

    return res.status(200).json({ ok: true, id });
  } catch (err: any) {
    console.error("Unexpected error sending email:", err);
    return res
      .status(500)
      .json({ ok: false, error: err?.message ?? String(err) });
  }
});

// for testing
router.get("/hello", (req, res) => {
  res.send("Hello World!");
});

api.use("/api", router);

export const handler = serverless(api);
