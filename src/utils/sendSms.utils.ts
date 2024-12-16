import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Define SMTP configurations using environment variables
const SMTP_SERVER = "smtp.gmail.com";
const SMTP_PORT = 587; // Port for STARTTLS
const SMTP_USERNAME = process.env.SMTP_USERNAME || "aihcl98@gmail.com";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "fyov rxcq udsf aaat";
const SMTP_FROM = process.env.SMTP_FROM || "aihcl98@gmail.com";

export async function sendEmail(subject: string, body: string, toEmail: string) {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
        host: SMTP_SERVER,
        port: SMTP_PORT,
        secure: false, // Use STARTTLS for port 587
        auth: {
            user: SMTP_USERNAME,
            pass: SMTP_PASSWORD,
        },
    });

    // Define the email HTML body
    const htmlBody = `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #f1f1f1; background-color: #1a202c; padding: 20px; border-radius: 8px;">
      <header style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #63b3ed; font-size: 24px;">AIHCL</h1>
      </header>
      <main>
        // <p style="color: #cbd5e0;">
        //   We received a request to reset your password. Please click the button below to reset your password:
        // </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${body}" style="display: inline-block; padding: 10px 20px; background-color: #63b3ed; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px;">Reset Your Password</a>
        </div>
        // <p style="color: #cbd5e0;">
        //   If you did not request this change, please ignore this email or contact our support if you have concerns.
        // </p>
        <p style="color: #cbd5e0;">Best regards,</p>
        <p style="font-size: 16px; color: #cbd5e0;"><strong>The AIHCL Team</strong></p>
      </main>
      <footer style="margin-top: 30px; text-align: center; color: #718096; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} AIHCL. All rights reserved.</p>
      </footer>
    </body>
    </html>
    `;

    // Define the mail options
    const mailOptions = {
        from: SMTP_FROM,
        to: toEmail,
        subject: subject,
        html: htmlBody,
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
