import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get pending registrations
// @route   GET /api/users/registrations/pending
// @access  Private/Admin
export const getPendingRegistrations = asyncHandler(async (req, res) => {
    const pendingUsers = await User.find({ accountStatus: 'pending' })
        .select('-password -verificationCode')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: pendingUsers.length,
        users: pendingUsers,
    });
});

// @desc    Approve registration and send verification code
// @route   POST /api/users/registrations/:id/approve
// @access  Private/Admin
export const approveRegistration = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.accountStatus !== 'pending') {
        res.status(400);
        throw new Error(`User status is ${user.accountStatus}, not pending`);
    }

    // Generate verification code
    const code = user.generateRegistrationCode();

    // Update user status
    user.accountStatus = 'approved';
    user.approvedBy = req.user._id;
    user.approvedAt = Date.now();

    await user.save();

    // Send verification code email
    const sendEmail = (await import('../utils/sendEmail.js')).default;
    const { verificationCodeTemplate } = await import('../utils/emailTemplates.js');

    try {
        await sendEmail({
            email: user.email,
            subject: 'Registration Approved - Verification Code',
            html: verificationCodeTemplate(user.name, code),
        });

        res.json({
            success: true,
            message: 'Registration approved and verification code sent',
            codeExpiresAt: user.verificationCodeExpires,
        });
    } catch (error) {
        // Revert approval if email fails
        user.accountStatus = 'pending';
        user.approvedBy = undefined;
        user.approvedAt = undefined;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        res.status(500);
        throw new Error('Failed to send verification email. Please try again.');
    }
});

// @desc    Reject registration
// @route   POST /api/users/registrations/:id/reject
// @access  Private/Admin
export const rejectRegistration = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.accountStatus !== 'pending') {
        res.status(400);
        throw new Error(`User status is ${user.accountStatus}, not pending`);
    }

    user.accountStatus = 'rejected';
    user.rejectionReason = reason || 'No reason provided';
    user.rejectedAt = Date.now();

    await user.save();

    // Send rejection email
    const sendEmail = (await import('../utils/sendEmail.js')).default;
    const { rejectionEmailTemplate } = await import('../utils/emailTemplates.js');

    try {
        await sendEmail({
            email: user.email,
            subject: 'Registration Status Update',
            html: rejectionEmailTemplate(user.name, user.rejectionReason),
        });
    } catch (error) {
        console.error('Failed to send rejection email:', error);
        // Continue anyway - rejection is already saved
    }

    res.json({
        success: true,
        message: 'Registration rejected',
    });
});

// @desc    Verify code and activate account
// @route   POST /api/users/verify-code
// @access  Public
export const verifyCode = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        res.status(400);
        throw new Error('Email and verification code are required');
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.accountStatus !== 'approved') {
        res.status(400);
        throw new Error('Account is not approved for verification');
    }

    // Validate code
    const validation = user.validateRegistrationCode(code);

    if (!validation.valid) {
        await user.save(); // Save updated attempts count
        res.status(400);
        throw new Error(validation.error);
    }

    // Activate account
    user.accountStatus = 'active';
    user.isVerified = true;
    user.clearRegistrationCode();

    await user.save();

    // Generate token
    const generateToken = (await import('../utils/generateToken.js')).default;

    res.json({
        success: true,
        message: 'Account activated successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        },
    });
});

// @desc    Resend verification code
// @route   POST /api/users/resend-code
// @access  Public
export const resendVerificationCode = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Email is required');
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.accountStatus !== 'approved') {
        res.status(400);
        throw new Error('Account is not approved');
    }

    // Check rate limiting (max 3 per day)
    if (user.lastCodeSentAt) {
        const hoursSinceLastCode = (Date.now() - user.lastCodeSentAt) / (1000 * 60 * 60);
        if (hoursSinceLastCode < 1) {
            res.status(429);
            throw new Error('Please wait at least 1 hour before requesting a new code');
        }
    }

    // Generate new code
    const code = user.generateRegistrationCode();
    await user.save();

    // Send email
    const sendEmail = (await import('../utils/sendEmail.js')).default;
    const { verificationCodeTemplate } = await import('../utils/emailTemplates.js');

    try {
        await sendEmail({
            email: user.email,
            subject: 'New Verification Code',
            html: verificationCodeTemplate(user.name, code),
        });

        res.json({
            success: true,
            message: 'New verification code sent',
            codeExpiresAt: user.verificationCodeExpires,
        });
    } catch (error) {
        res.status(500);
        throw new Error('Failed to send verification email');
    }
});
