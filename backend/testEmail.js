import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
    console.log('Testing email configuration...');
    console.log('Email:', process.env.EMAIL_USERNAME);
    console.log('Password length:', process.env.EMAIL_PASSWORD?.length);

    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Verify connection
        await transporter.verify();
        console.log('✅ SMTP connection verified!');

        // Send test email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: process.env.EMAIL_USERNAME, // Send to yourself
            subject: 'Test Email - Netflixfake',
            html: '<h1>Email configuration works!</h1><p>Your Gmail App Password is configured correctly.</p>',
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Check your inbox:', process.env.EMAIL_USERNAME);
    } catch (error) {
        console.error('❌ Email test failed:');
        console.error('Error:', error.message);

        if (error.code === 'EAUTH') {
            console.error('\n⚠️  Authentication failed. Possible issues:');
            console.error('1. Wrong App Password (check for typos)');
            console.error('2. 2FA not enabled on Google Account');
            console.error('3. App Password not created correctly');
            console.error('\nGet new App Password: https://myaccount.google.com/apppasswords');
        }
    }
}

testEmail();
