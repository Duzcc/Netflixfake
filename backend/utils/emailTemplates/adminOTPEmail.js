export const adminOTPEmailTemplate = (otpCode) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 3px dashed #EF4444; padding: 30px; text-align: center; border-radius: 10px; margin: 30px 0; }
        .otp-code { font-size: 48px; font-weight: bold; letter-spacing: 10px; color: #EF4444; font-family: 'Courier New', monospace; }
        .warning { background: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .security-notice { background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🔐 Admin Login Verification</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Two-Factor Authentication</p>
        </div>
        
        <div class="content">
            <p style="font-size: 16px;">Hello Admin,</p>
            
            <p>You are attempting to log in to your Netflixfake admin account. Please use the following One-Time Password (OTP) to complete your login:</p>
            
            <div class="otp-box">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your OTP Code:</p>
                <div class="otp-code">${otpCode}</div>
            </div>
            
            <div class="warning">
                <strong>⏱️ Important:</strong> This code will expire in <strong>1 minute</strong>. Please enter it as soon as possible.
            </div>
            
            <div class="security-notice">
                <strong>🔒 Security Notice:</strong>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>Never share this code with anyone</li>
                    <li>Our team will never ask for your OTP code</li>
                    <li>If you didn't attempt to log in, please secure your account immediately</li>
                </ul>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
                If you didn't request this code, please ignore this email and ensure your account is secure.
            </p>
        </div>
        
        <div class="footer">
            <p>This is an automated security message from Netflixfake</p>
            <p>© ${new Date().getFullYear()} Netflixfake. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
};
