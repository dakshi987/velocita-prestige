import 'dotenv/config';
import nodemailer, { type Transporter } from 'nodemailer';

let cachedTransporter: Transporter | null = null;

function getMailConfiguration() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const port = Number(process.env.SMTP_PORT || 587);

  const missing = [
    !host && 'SMTP_HOST',
    !user && 'SMTP_USER',
    !pass && 'SMTP_PASS',
    !adminEmail && 'ADMIN_EMAIL',
  ].filter((value): value is string => Boolean(value));

  if (!host || !user || !pass || !adminEmail) {
    throw new Error(`Missing required mail configuration: ${missing.join(', ')}.`);
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP_PORT must be an integer between 1 and 65535.');
  }

  return { host, user, pass, adminEmail, port };
}

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const { host, user, pass, port } = getMailConfiguration();
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransporter;
}

/**
 * Sends an email to the administrator or, when specified, a custom recipient.
 * The SMTP_USER account must be authorized to send through the configured SMTP host.
 */
export async function sendAdminEmail(subject: string, htmlContent: string, toEmail?: string) {
  const { adminEmail, user } = getMailConfiguration();
  const recipient = toEmail?.trim() || adminEmail;

  try {
    const info = await getTransporter().sendMail({
      from: user,
      to: recipient,
      subject,
      html: htmlContent,
    });

    console.log(`[Mailer] Email sent to ${recipient}: "${subject}" (MessageID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`[Mailer Error] Failed to send email to ${recipient}:`, error);
    throw error;
  }
}

/**
 * Sends a confirmation email to a customer.
 */
export async function sendUserEmail(userEmail: string, subject: string, htmlContent: string) {
  return sendAdminEmail(subject, htmlContent, userEmail);
}
