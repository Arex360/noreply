const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5001;

// Middleware to parse JSON
app.use(express.json());

// Configure Nodemailer with Zoho SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
    },
});

// HTML Template for Auto-Reply Email
const htmlTemplate = (firstName,lastName)=>`
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
            color: #333333;
        }
        .header {
            text-align: center;
            padding: 10px 0;
            background-color: #0073e6;
            color: #ffffff;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            text-align: left;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            margin-top: 20px;
        }
        .footer a {
            color: #0073e6;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Thank You!</h1>
        </div>
        <div class="content">
            <p>Dear ${firstName} ${lastName},</p>
            <p>Thank you for reaching out to us! We’ve received your message and will get back to you as soon as possible.</p>
            <p>If you have any additional information or questions, feel free to reply to this email, although please note this is a no-reply email address, and we may not be able to respond directly.</p>
            <p>In the meantime, feel free to explore our website for more information:</p>
            <p><a href="https://itsarex.com" target="_blank" style="color: #0073e6;">Visit Our Website</a></p>
            <p>Best regards,</p>
            <p>Muhammad Owais</p>
        </div>
        <div class="footer">
            <p>This is an automated email; please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
`;

// Route to send email
app.post('/send-email', async (req, res) => {
    const { to, subject, text, first,last } = req.body;

    // Auto-Reply Email Options
    const autoReplyOptions = {
        from: process.env.ZOHO_USER,
        to,
        subject: "Thanks For Contacting Me",
        html: htmlTemplate(first,last), // Use `html` for HTML content
    };

    // Send Auto-Reply Email
    try {
        await transporter.sendMail(autoReplyOptions);
    } catch (error) {
        return res.status(500).json({
            message: 'Error sending auto-reply email',
            error: error.message,
        });
    }

    // Email to Admin (You)
    const adminEmailOptions = {
        from: process.env.ZOHO_USER,
        to: "riotsystudio@gmail.com", // Your email address
        subject,
        text, // Message content from the user
    };

    // Send Email to Admin
    try {
        const info = await transporter.sendMail(adminEmailOptions);
        res.status(200).json({
            message: 'Emails sent successfully!',
            info,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error sending email to admin',
            error: error.message,
        });
    }
});
app.get('/',(req,res)=>res.send("ok"))
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
