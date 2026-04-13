const nodemailer = require('nodemailer');
require('dotenv').config();

const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass,
    },
});

const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'email_debug.log');

const logToFile = (message) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
};

const sendEmail = async (to, subject, text) => {
    const logMsg = `Attempting to send email to: ${to}`;
    console.log(logMsg);
    logToFile(logMsg);

    if (!emailUser || !emailPass) {
        const msg = 'WARN: Email credentials not found in .env. Email not sent.';
        console.warn(msg);
        logToFile(msg);
        return;
    }

    try {
        const mailOptions = {
            from: emailUser,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        const successMsg = 'Email sent: ' + info.response;
        console.log(successMsg);
        logToFile(successMsg);
    } catch (error) {
        console.error('Error sending email:', error);
        logToFile(`ERROR sending email: ${error.message}`);
        logToFile(`Full Error: ${JSON.stringify(error)}`);
    }
};

module.exports = sendEmail;
