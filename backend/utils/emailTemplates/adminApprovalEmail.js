export const adminApprovalEmailTemplate = (userName, userEmail, approvalLink) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .user-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid #eee; }
        .info-label { font-weight: bold; width: 100px; color: #666; }
        .info-value { flex: 1; color: #333; }
        .approve-button { display: inline-block; background: #10B981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .approve-button:hover { background: #059669; }
        .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🔔 New User Registration</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Action Required</p>
        </div>
        
        <div class="content">
            <p style="font-size: 16px;">Hello Admin,</p>
            
            <p>A new user has registered and is waiting for your approval.</p>
            
            <div class="user-info">
                <h3 style="margin-top: 0; color: #667eea;">User Details</h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${userName}</span>
                </div>
                <div class="info-row" style="border-bottom: none;">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${userEmail}</span>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="${approvalLink}" class="approve-button">
                    ✅ Approve User
                </a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Important:</strong> This approval link will expire in 24 hours. After approval, the user will receive a confirmation email and can immediately log in to their account.
            </div>
            
            <p style="font-size: 14px; color: #666;">
                If you did not expect this registration or want to reject this user, you can safely ignore this email. The user will not be able to access the system without your approval.
            </p>
        </div>
        
        <div class="footer">
            <p>This is an automated message from Netflixfake Admin System</p>
            <p>© ${new Date().getFullYear()} Netflixfake. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
};

export const userApprovedEmailTemplate = (userName) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success-icon { font-size: 60px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">🎉</div>
            <h1 style="margin: 0;">Account Approved!</h1>
        </div>
        
        <div class="content">
            <p style="font-size: 16px;">Hello ${userName},</p>
            
            <p>Great news! Your Netflixfake account has been approved by our admin team.</p>
            
            <p><strong>You can now log in and start enjoying our services!</strong></p>
            
            <p style="margin-top: 30px;">Thank you for joining Netflixfake. We hope you enjoy your experience!</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Netflixfake. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
};
