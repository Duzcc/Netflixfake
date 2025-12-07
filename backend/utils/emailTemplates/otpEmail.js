export const otpEmailTemplate = (userName, otp, purpose = 'verification') => {
    const purposeText = {
        'registration': 'complete your registration',
        'login': 'log in to your account',
        'verification': 'verify your email',
    }[purpose] || 'verify your identity';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f0f;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #1a1a1a; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #E50914 0%, #831010 100%);">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔐 Email Verification</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #ffffff; font-size: 16px; line-height: 1.6;">
                                Hi <strong>${userName}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #b3b3b3; font-size: 15px; line-height: 1.6;">
                                Thank you for registering! To ${purposeText}, please use the verification code below:
                            </p>
                            
                            <!-- OTP Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center; padding: 30px; background-color: #2a2a2a; border-radius: 8px; border: 2px dashed #E50914;">
                                        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #E50914; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </div>
                                        <p style="margin: 15px 0 0; color: #808080; font-size: 12px;">
                                            Valid for 10 minutes
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="margin: 30px 0; padding: 20px; background-color: #2a2a2a; border-left: 4px solid #E50914; border-radius: 4px;">
                                <p style="margin: 0; color: #b3b3b3; font-size: 14px; line-height: 1.6;">
                                    <strong style="color: #ffffff;">⚠️ Security Note:</strong><br>
                                    • Never share this code with anyone<br>
                                    • Our team will never ask for your OTP<br>
                                    • This code expires in 10 minutes
                                </p>
                            </div>
                            
                            <p style="margin: 30px 0 0; color: #808080; font-size: 13px; line-height: 1.6;">
                                If you didn't request this code, please ignore this email or contact our support team.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #0a0a0a; text-align: center;">
                            <p style="margin: 0 0 10px; color: #808080; font-size: 12px;">
                                © ${new Date().getFullYear()} Netflixfake. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #666666; font-size: 11px;">
                                This is an automated message, please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};
