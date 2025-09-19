import { Resend } from "resend";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const { email, message } = JSON.parse(event.body);

  if (!email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing fields" })
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "albonniqusai@gmail.com",
      replyTo: email,
      subject: "Portfolio Contact Form Submission",
      html: `<p>You got a new message from ${email}:</p><p>${message}</p>`
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ ok: false, error: error.message })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: data.id })
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.toString() })
    };
  }
}
