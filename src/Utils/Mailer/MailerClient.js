export let transporter = null;

try {
  const nodemailer = (await import("nodemailer")).default;
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 465,
    secure: Number(process.env.MAIL_PORT) === 465,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ SMTP Connection Error:", error.message);
      if (!process.env.MAIL_USER) console.error("   - MAIL_USER is missing or empty");
      if (!process.env.MAIL_PASS) console.error("   - MAIL_PASS is missing or empty");
    } else {
      console.log("📧 SMTP Server is ready to take messages");
    }
  });
} catch (e) {
  // nodemailer is optional or not installed
}
