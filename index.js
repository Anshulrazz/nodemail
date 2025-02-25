require("dotenv").config();
const nodemailer = require("nodemailer");
const cron = require("node-cron");

// Create the email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // Use SSL/TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Function to send email
async function sendEmail() {
    try {
        let info = await transporter.sendMail({
            from: `"Anshul Rajpoot" <${process.env.SMTP_USER}>`,
            to: process.env.RECIPIENT_EMAIL,
            subject: "Thanks for Subscribing!",
            text: "Hello! This is Anshul Kumar",
            html: `
        <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Yatra+One&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Yatra One', system-ui;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 20px auto;">
                <tr>
                    <td align="center" bgcolor="#4CAF50" style="padding: 20px 0; color: #ffffff; font-size: 24px;">
                        <h1 style="margin: 0;">Thank You for Subscribing!</h1>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="color: #333333; font-size: 16px;">
                                    <p style="margin: 0;">Hello,</p>
                                    <p style="margin: 20px 0;">Thank you for subscribing to our newsletter! We are excited to have you with us. Stay tuned for the latest updates, news, and special offers straight to your inbox.</p>
                                    <p style="margin: 20px 0;">We promise to keep you informed and engaged with the best content. If you have any questions or suggestions, feel free to reach out to us at any time.</p>
                                    <p style="margin: 20px 0;">Best regards,<br>Anshul Kumar</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#f4f4f4" style="padding: 30px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" style="color: #333333; font-size: 14px;">
                                    <p style="margin: 0;">Follow us on:</p>
                                    <a href="https://www.facebook.com/anshul.kumar.639692" style="text-decoration: none; color: #4CAF50; margin: 0 10px;">Facebook</a> |
                                    <a href="https://x.com/anshul_000012" style="text-decoration: none; color: #4CAF50; margin: 0 10px;">Twitter</a> |
                                    <a href="https://www.instagram.com/anshul_6396" style="text-decoration: none; color: #4CAF50; margin: 0 10px;">Instagram</a> |
                                    <a href="https://www.linkedin.com/in/anshul-kumar-b92421306/" style="text-decoration: none; color: #4CAF50; margin: 0 10px;">LinkedIn</a> |
                                    <a href="https://www.youtube.com/@codewith47" style="text-decoration: none; color: #4CAF50; margin: 0 10px;">YouTube</a>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="color: #999999; font-size: 12px; padding-top: 20px;">
                                    <p style="margin: 0;">You received this email because you subscribed to our newsletter.</p>
                                    <p style="margin: 0;">If you no longer wish to receive emails from us, <a href="#" style="text-decoration: none; color: #4CAF50;">unsubscribe here</a>.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`
        });

        console.log("✅ Email sent successfully:", info.messageId);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}

// Schedule email sending (e.g., every day at 9 AM)
cron.schedule("0 9 * * *", () => {
    console.log("⏳ Sending automated email at 9 AM...");
    sendEmail();
});

// Start script immediately
sendEmail();
