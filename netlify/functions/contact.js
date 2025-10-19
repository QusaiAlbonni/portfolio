import { Resend } from "resend";
/**
 * @deprecated
 */
export async function handler(event, context) {
  const allowedOrigin =
    process.env.SITE_URL || "https://qusayalbonniportfolio.netlify.app";
  const origin = event.headers.origin || event.headers.referer || "";

  if (event.httpMethod === "OPTIONS") {
    if (origin && origin.startsWith(allowedOrigin)) {
      return {
        statusCode: 204,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Credentials": "true",
        },
        body: "",
      };
    }
    return { statusCode: 403, body: "Forbidden" };
  }

  if (!origin || !origin.startsWith(allowedOrigin)) {
    return { statusCode: 403, body: "Forbidden" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const { email, message, subject } = JSON.parse(event.body);

  if (!email || !message || !subject) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Missing fields" }),
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "albonniqusai@gmail.com",
      replyTo: email.toString(),
      subject: subject.toString(),
      html: `<p>You got a new message from ${email.toString()}:</p><p>${message.toString()}</p>`,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Credentials": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ok: false, error: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ok: true, id: data.id }),
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json",
      },
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.toString() }),
    };
  }
}
