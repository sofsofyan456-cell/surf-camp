
import "server-only";

import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(
  recipient: string,
  resetUrl: string,
): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM;

  if (!host || !port || !user || !pass || !from) {
    throw new Error("SMTP configuration is incomplete.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: recipient,
    subject: "Reset your Surf & Sand Camp admin password",
    text: [
      "We received a request to reset your admin password.",
      "",
      "Open this link to choose a new password:",
      resetUrl,
      "",
      "This link expires in 15 minutes and can only be used once.",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
        <h2>Reset your admin password</h2>
        <p>We received a request to reset your Surf &amp; Sand Camp admin password.</p>
        <p>
          <a href="${resetUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"
             style="display:inline-block;padding:12px 20px;background:#0891b2;color:white;text-decoration:none;border-radius:8px">
            Reset password
          </a>
        </p>
        <p>This link expires in 15 minutes and can only be used once.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
}
