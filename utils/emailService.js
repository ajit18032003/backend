const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // For testing purposes, you can use ethereal.email or a real Gmail account
    // For a real production app, use an SMTP service like SendGrid, Mailgun, etc.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_PORT || 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Portfolio Admin" <${process.env.EMAIL_FROM || 'admin@portfolio.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
