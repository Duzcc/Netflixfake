/**
 * Welcome email template for new users
 * @param {string} userName - User's name
 * @param {string} userEmail - User's email
 * @returns {string} HTML email template
 */
export const welcomeEmailTemplate = (userName, userEmail) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Netflixo!</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #141414;
            color: #ffffff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .logo {
            text-align: center;
            margin-bottom: 40px;
        }
        .logo h1 {
            color: #e50914;
            font-size: 48px;
            margin: 0;
            font-weight: bold;
        }
        .content {
            background-color: #1f1f1f;
            border-radius: 8px;
            padding: 40px;
        }
        h2 {
            color: #ffffff;
            font-size: 28px;
            margin-top: 0;
        }
        p {
            color: #d0d0d0;
            font-size: 16px;
            line-height: 1.6;
        }
        .highlight {
            color: #e50914;
            font-weight: bold;
        }
        .features {
            margin: 30px 0;
        }
        .feature-item {
            padding: 15px 0;
            border-bottom: 1px solid #333;
        }
        .feature-item:last-child {
            border-bottom: none;
        }
        .feature-item h3 {
            color: #e50914;
            margin: 0 0 8px 0;
            font-size: 18px;
        }
        .cta-button {
            display: inline-block;
            background-color: #e50914;
            color: #ffffff;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 4px;
            margin: 30px 0;
            font-weight: bold;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #808080;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>NETFLIXO</h1>
        </div>
        <div class="content">
            <h2>Welcome to Netflixo, ${userName}!</h2>
            <p>Thank you for joining our streaming community. We're excited to have you on board!</p>
            
            <p>Your account (<span class="highlight">${userEmail}</span>) is now active and ready to use.</p>
            
            <div class="features">
                <div class="feature-item">
                    <h3>🎬 Unlimited Movies & TV Shows</h3>
                    <p>Access thousands of titles from around the world</p>
                </div>
                <div class="feature-item">
                    <h3>⭐ Personalized Recommendations</h3>
                    <p>Get movie suggestions tailored to your taste</p>
                </div>
                <div class="feature-item">
                    <h3>📱 Watch Anywhere</h3>
                    <p>Stream on your phone, tablet, or computer</p>
                </div>
                <div class="feature-item">
                    <h3>💾 Create Your Watchlist</h3>
                    <p>Save movies and shows to watch later</p>
                </div>
            </div>
            
            <center>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="cta-button">Start Watching Now</a>
            </center>
            
            <p style="margin-top: 30px;">If you have any questions, feel free to reach out to our support team.</p>
            
            <p style="margin-top: 20px;">
                Enjoy streaming!<br>
                <strong>The Netflixo Team</strong>
            </p>
        </div>
        <div class="footer">
            <p>© 2024 Netflixo. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
    `;
};

/**
 * Password reset email template
 * @param {string} userName - User's name
 * @param {string} resetUrl - Password reset URL
 * @returns {string} HTML email template
 */
export const passwordResetTemplate = (userName, resetUrl) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #141414;
            color: #ffffff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .logo {
            text-align: center;
            margin-bottom: 40px;
        }
        .logo h1 {
            color: #e50914;
            font-size: 48px;
            margin: 0;
            font-weight: bold;
        }
        .content {
            background-color: #1f1f1f;
            border-radius: 8px;
            padding: 40px;
        }
        h2 {
            color: #ffffff;
            font-size: 28px;
            margin-top: 0;
        }
        p {
            color: #d0d0d0;
            font-size: 16px;
            line-height: 1.6;
        }
        .warning-box {
            background-color: #2d1a1a;
            border-left: 4px solid #e50914;
            padding: 15px;
            margin: 20px 0;
        }
        .warning-box p {
            margin: 0;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background-color: #e50914;
            color: #ffffff;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 4px;
            margin: 30px 0;
            font-weight: bold;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #808080;
            font-size: 14px;
        }
        .expiry-notice {
            color: #e50914;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>NETFLIXO</h1>
        </div>
        <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello ${userName},</p>
            
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <center>
                <a href="${resetUrl}" class="cta-button">Reset Password</a>
            </center>
            
            <div class="warning-box">
                <p><strong>⏰ Important:</strong> This link will expire in <span class="expiry-notice">10 minutes</span>.</p>
            </div>
            
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p style="margin-top: 30px; font-size: 14px; color: #999;">
                <strong>Trouble clicking the button?</strong> Copy and paste this URL into your browser:<br>
                <span style="color: #e50914;">${resetUrl}</span>
            </p>
        </div>
        <div class="footer">
            <p>© 2024 Netflixo. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
    `;
};

/**
 * Premium subscription success template
 * @param {string} userName - User's name
 * @param {string} planName - Subscription plan name
 * @param {string} amount - Payment amount
 * @returns {string} HTML email template
 */
export const subscriptionSuccessTemplate = (userName, planName = 'Premium', amount = '$9.99') => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Premium!</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #141414;
            color: #ffffff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .logo {
            text-align: center;
            margin-bottom: 40px;
        }
        .logo h1 {
            color: #e50914;
            font-size: 48px;
            margin: 0;
            font-weight: bold;
        }
        .content {
            background-color: #1f1f1f;
            border-radius: 8px;
            padding: 40px;
        }
        h2 {
            color: #ffffff;
            font-size: 28px;
            margin-top: 0;
        }
        p {
            color: #d0d0d0;
            font-size: 16px;
            line-height: 1.6;
        }
        .success-icon {
            text-align: center;
            font-size: 64px;
            margin: 20px 0;
        }
        .plan-details {
            background-color: #2a2a2a;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        .plan-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #404040;
        }
        .plan-row:last-child {
            border-bottom: none;
        }
        .plan-label {
            color: #999;
        }
        .plan-value {
            color: #ffffff;
            font-weight: bold;
        }
        .premium-features {
            margin: 30px 0;
        }
        .feature {
            padding: 10px 0;
            display: flex;
            align-items: center;
        }
        .feature::before {
            content: "✨";
            margin-right: 10px;
            font-size: 20px;
        }
        .cta-button {
            display: inline-block;
            background-color: #e50914;
            color: #ffffff;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 4px;
            margin: 30px 0;
            font-weight: bold;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #808080;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>NETFLIXO</h1>
        </div>
        <div class="content">
            <div class="success-icon">🎉</div>
            <h2 style="text-align: center;">Welcome to Premium!</h2>
            <p style="text-align: center;">Congratulations, ${userName}! Your subscription is now active.</p>
            
            <div class="plan-details">
                <div class="plan-row">
                    <span class="plan-label">Plan</span>
                    <span class="plan-value">${planName}</span>
                </div>
                <div class="plan-row">
                    <span class="plan-label">Amount Paid</span>
                    <span class="plan-value">${amount}</span>
                </div>
                <div class="plan-row">
                    <span class="plan-label">Status</span>
                    <span class="plan-value" style="color: #46d369;">Active</span>
                </div>
            </div>
            
            <h3 style="color: #e50914; margin-top: 30px;">Premium Benefits:</h3>
            <div class="premium-features">
                <div class="feature">Ad-free streaming experience</div>
                <div class="feature">Early access to new releases</div>
                <div class="feature">HD & 4K quality available</div>
                <div class="feature">Download for offline viewing</div>
                <div class="feature">Priority customer support</div>
                <div class="feature">Exclusive premium content</div>
            </div>
            
            <center>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="cta-button">Start Watching Premium Content</a>
            </center>
            
            <p style="margin-top: 30px; font-size: 14px;">
                Your subscription will automatically renew. You can manage your subscription settings in your account.
            </p>
        </div>
        <div class="footer">
            <p>© 2024 Netflixo. All rights reserved.</p>
            <p>Questions? Contact us at support@netflixo.com</p>
        </div>
    </div>
</body>
</html>
    `;
};

// Export existing templates (from original file)
export { verificationEmailTemplate, resendVerificationTemplate } from './emailTemplates.js';
