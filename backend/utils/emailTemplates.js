/**
 * Email Templates for Netflix Application
 */

const getBaseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #E50914 0%, #B20710 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .content p {
            margin: 0 0 20px;
            font-size: 16px;
            color: #555;
        }
        .button {
            display: inline-block;
            padding: 14px 30px;
            background: #E50914;
            color: white !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            margin: 20px 0;
            transition: background 0.3s;
        }
        .button:hover {
            background: #B20710;
        }
        .footer {
            background: #f8f8f8;
            padding: 20px 30px;
            text-align: center;
            font-size: 13px;
            color: #999;
            border-top: 1px solid #eee;
        }
        .footer p {
            margin: 5px 0;
        }
        .divider {
            height: 1px;
            background: #eee;
            margin: 30px 0;
        }
        .info-box {
            background: #f8f9fa;
            border-left: 4px solid #E50914;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-box p {
            margin: 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎬 Netflix</h1>
        </div>
        ${content}
        <div class="footer">
            <p>This is an automated email from Netflix. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Netflix. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Email verification template
 * @param {string} name - User's name
 * @param {string} verificationUrl - Verification link URL
 * @returns {string} HTML email template
 */
export const verificationEmailTemplate = (name, verificationUrl) => {
    const content = `
        <div class="content">
            <h2 style="color: #333; margin-top: 0;">Welcome to Netflix, ${name}! 🎉</h2>
            <p>Thank you for signing up! We're excited to have you join our community.</p>
            <p>To complete your registration and start enjoying unlimited movies and shows, please verify your email address by clicking the button below:</p>
            
            <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </center>
            
            <div class="info-box">
                <p><strong>⏰ Important:</strong> This verification link will expire in 24 hours for security purposes.</p>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #777;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 13px; color: #999; word-break: break-all;">${verificationUrl}</p>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #777;"><strong>Didn't create an account?</strong> You can safely ignore this email.</p>
        </div>
    `;

    return getBaseTemplate(content);
};

/**
 * Resend verification email template
 * @param {string} name - User's name
 * @param {string} verificationUrl - Verification link URL
 * @returns {string} HTML email template
 */
export const resendVerificationTemplate = (name, verificationUrl) => {
    const content = `
        <div class="content">
            <h2 style="color: #333; margin-top: 0;">Email Verification Request</h2>
            <p>Hi ${name},</p>
            <p>You requested a new verification link for your Netflix account. Click the button below to verify your email address:</p>
            
            <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </center>
            
            <div class="info-box">
                <p><strong>⏰ Reminder:</strong> This verification link will expire in 24 hours.</p>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #777;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 13px; color: #999; word-break: break-all;">${verificationUrl}</p>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #777;"><strong>Didn't request this?</strong> You can safely ignore this email.</p>
        </div>
    `;

    return getBaseTemplate(content);
};

/**
 * Email verified success notification
 * @param {string} name - User's name
 * @returns {string} HTML email template
 */
export const emailVerifiedTemplate = (name) => {
    const content = `
        <div class="content">
            <h2 style="color: #28a745; margin-top: 0;">✅ Email Verified Successfully!</h2>
            <p>Hi ${name},</p>
            <p>Congratulations! Your email address has been successfully verified.</p>
            <p>You can now log in to your Netflix account and start enjoying:</p>
            
            <ul style="color: #555; line-height: 2;">
                <li>🎬 Unlimited movies and TV shows</li>
                <li>📱 Watch on any device</li>
                <li>⭐ Personalized recommendations</li>
                <li>💾 Create your watchlist</li>
            </ul>
            
            <center>
                <a href="http://localhost:5174/login" class="button">Log In Now</a>
            </center>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #777;">Happy watching! 🍿</p>
        </div>
    `;

    return getBaseTemplate(content);
};

// Verification Code Email Template
export const verificationCodeTemplate = (name, code) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #E50914 0%, #B20710 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f4f4f4; padding: 30px; border-radius: 0 0 10px 10px; }
        .code-box { background: white; border: 3px dashed #E50914; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
        .code { font-size: 32px; font-weight: bold; color: #E50914; letter-spacing: 8px; font-family: monospace; }
        .button { display: inline-block; background: #E50914; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Registration Approved!</h1>
        </div>
        <div class="content">
            <h2>Hello ${name},</h2>
            <p>Great news! Your registration has been approved by our admin team.</p>
            <p>To complete your account activation, please use the verification code below:</p>
            
            <div class="code-box">
                <div class="code">${code}</div>
            </div>
            
            <p><strong>Important:</strong></p>
            <ul>
                <li>This code will expire in <strong>24 hours</strong></li>
                <li>You have 5 attempts to enter the correct code</li>
                <li>Keep this code secure and don't share it with anyone</li>
            </ul>
            
            <p>Once verified, you'll have full access to all Netflix features!</p>
            
            <div class="footer">
                <p>If you didn't request this, please ignore this email.</p>
                <p>&copy; 2024 Netflix Clone. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Rejection Email Template
export const rejectionEmailTemplate = (name, reason) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #666; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f4f4f4; padding: 30px; border-radius: 0 0 10px 10px; }
        .reason-box { background: white; border-left: 4px solid #666; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Registration Status Update</h1>
        </div>
        <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for your interest in joining our platform.</p>
            <p>After careful review, we're unable to approve your registration at this time.</p>
            
            <div class="reason-box">
                <strong>Reason:</strong><br>
                ${reason}
            </div>
            
            <p>If you believe this was a mistake or have questions, please contact our support team.</p>
            
            <div class="footer">
                <p>&copy; 2024 Netflix Clone. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// All templates exported above

