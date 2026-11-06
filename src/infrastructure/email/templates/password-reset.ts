import { env } from "../../../config";

export function buildPasswordResetEmail(resetUrl: string): { subject: string; text: string; html: string } {
  const minutes = env.PASSWORD_RESET_EXPIRES_MINUTES;
  const subject = "Reset your EBRS password";

  const text = [
    "EBRS password reset",
    "",
    "We received a request to reset the password for your EBRS account.",
    "",
    `Reset your password (link expires in ${minutes} minutes):`,
    resetUrl,
    "",
    "If you did not request a password reset, you can safely ignore this email. Your password will stay the same.",
    "",
    "— EBRS · Enterprise Booking & Reservation System",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="background-color:#0f172a;padding:28px 32px;text-align:left;">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.5px;color:#ffffff;">EBRS</p>
              <p style="margin:6px 0 0;font-size:13px;color:#94a3b8;">Enterprise Booking &amp; Reservation System</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 28px;">
              <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;font-weight:700;color:#0f172a;">Reset your password</h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#475569;">
                We received a request to reset the password for your EBRS account. Click the button below to choose a new password.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" style="border-radius:8px;background-color:#2563eb;">
                    <a href="${resetUrl}"
                       style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Reset password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#64748b;">
                This link expires in <strong style="color:#0f172a;">${minutes} minutes</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e5e7eb;">
                <tr>
                  <td style="padding-top:20px;">
                    <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8;">
                      If you didn’t request this, you can ignore this email. Your password will not change.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:18px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8;text-align:center;">
                © ${new Date().getFullYear()} EBRS. This is an automated message — please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}
