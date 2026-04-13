require('dotenv').config();
const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

console.log('--- Email Configuration Check ---');
console.log('User:', emailUser ? emailUser : 'MISSING');
console.log('Pass:', emailPass ? '**** (Present)' : 'MISSING');

if (!emailUser || !emailPass) {
    console.error('ERROR: Missing credentials. Please check your .env file.');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass,
    },
});

const sendTestEmail = async () => {
    try {
        console.log('Attempting to send test email...');
        const info = await transporter.sendMail({
            from: emailUser,
            to: emailUser, // Send to self for testing
            subject: 'Test Email from CyberSafe Debugger',
            text: 'If you are reading this, the email configuration is working!',
        });
        console.log('SUCCESS: Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
    } catch (error) {
        console.error('FAILURE: Error sending email.');
        console.error(error);
    }
};

sendTestEmail();
