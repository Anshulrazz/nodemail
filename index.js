require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose");
const Message = require("./Message");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose
  .connect("mongodb://localhost:27017/ansh", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Create the email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Route to save contact message
app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    res.status(201).json({ message: "Contact saved successfully" });
  } catch (error) {
    console.error("❌ Error saving contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Email sending route
app.post("/send-email", async (req, res) => {
  const { recipientEmail } = req.body;

  if (!recipientEmail) {
    return res.status(400).json({ error: "Recipient email is required" });
  }

  try {
    let info = await transporter.sendMail({
      from: `"Basaani Travels" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: "Welcome to My Portfolio!",
      text: "Hello! Thank you for visiting my portfolio. I appreciate your interest in my work!",
      html: `
             <html>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Poppins', sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; }
                    .header { background: #4CAF50; padding: 20px; color: white; font-size: 24px; font-weight: 600; border-radius: 8px 8px 0 0; }
                    .content { padding: 20px; color: #333; font-size: 16px; }
                    .footer { padding: 20px; font-size: 14px; color: #777; }
                    .button { display: inline-block; background: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">👋 Welcome to My Portfolio!</div>
                    <div class="content">
                        <p>Hey there,</p>
                        <p>Thank you for exploring my portfolio. I'm excited to share my work, projects, and creative journey with you.</p>
                        <p>Feel free to connect with me, provide feedback, or collaborate on exciting opportunities!</p>
                        <a href="https://anshulkumar.tech" class="button">Visit My Portfolio</a>
                    </div>
                    <div class="footer">
                        <p>Follow me on:</p>
                        <p>
                            <a href="https://linkedin.com/in/anshul-kumar-b92421306">LinkedIn</a> | 
                            <a href="https://github.com/Anshulrazz">GitHub</a> | 
                            <a href="https://twitter.com/anshul_000012">Twitter</a>
                        </p>
                        <p>Looking forward to connecting with you!</p>
                    </div>
                </div>
            </body>
            </html>`,
    });

    console.log("✅ Email sent:", info.messageId);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
