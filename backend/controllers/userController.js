import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import { verificationEmailTemplate, resendVerificationTemplate } from '../utils/emailTemplates.js';
import { adminApprovalEmailTemplate } from '../utils/emailTemplates/adminApprovalEmail.js';
import OTP from '../models/OTP.js';
import { otpEmailTemplate } from '../utils/emailTemplates/otpEmail.js';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, image } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Check if email verification should be skipped (dev mode without email config)
    const hasRealEmailConfig =
        process.env.EMAIL_USERNAME &&
        process.env.EMAIL_PASSWORD &&
        !process.env.EMAIL_USERNAME.includes('your_email') &&
        !process.env.EMAIL_PASSWORD.includes('password');

    const skipEmailVerification =
        process.env.NODE_ENV === 'development' && !hasRealEmailConfig;

    const user = await User.create({
        name,
        email,
        password,
        image,
        // User starts as pending until OTP verified
        accountStatus: skipEmailVerification ? 'active' : 'pending',
        isVerified: skipEmailVerification,
    });

    if (user) {
        if (skipEmailVerification) {
            // Skip email verification in development mode - auto-approve
            res.status(201).json({
                success: true,
                message: 'Registration successful! You can now log in.',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    token: generateToken(user._id),
                },
            });
        } else {
            // Send OTP to user email for verification
            const otp = await OTP.generateOTP(user._id, user.email);

            // For testing: send OTP to admin email (from .env) instead of user email
            const testEmail = process.env.EMAIL_USERNAME || user.email;

            try {
                await sendEmail({
                    email: testEmail, // Send to admin email for testing
                    subject: '🔐 Verify Your Email - Registration OTP',
                    html: otpEmailTemplate(user.name, otp, 'registration'),
                });

                res.status(201).json({
                    success: true,
                    requireOTP: true,
                    message: `Verification code sent to ${testEmail} (for testing)`,
                    email: testEmail,
                    userId: user._id,
                });
            } catch (error) {
                console.error('Error sending OTP email:', error);

                // Development fallback - log OTP to console
                console.log('\n🔐 DEVELOPMENT MODE - REGISTRATION OTP:');
                console.log(`🔑 User: ${user.email} (${user.name})`);
                console.log(`🔑 OTP sent to: ${testEmail}`);
                console.log(`🔑 OTP: ${otp}\n`);

                res.status(201).json({
                    success: true,
                    requireOTP: true,
                    message: 'Registration successful! Check console for OTP (dev mode).',
                    email: testEmail,
                    userId: user._id,
                    devOTP: otp, // Only in dev mode
                });
            }
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, deviceId } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Check if user is banned
        if (user.banned) {
            res.status(403);
            throw new Error(`Your account has been banned. Reason: ${user.bannedReason || 'Violation of terms'}`);
        }

        // Check account status for admin-approved registration flow
        if (user.accountStatus === 'pending') {
            res.status(403);
            throw new Error('Your registration is pending admin approval. Please wait for approval email.');
        }

        if (user.accountStatus === 'rejected') {
            res.status(403);
            throw new Error(`Your registration was not approved. Reason: ${user.rejectionReason || 'Please contact support'}`);
        }

        if (user.accountStatus === 'approved') {
            res.status(403);
            throw new Error('Please verify your account using the code sent to your email.');
        }

        // Check if email is verified (for old email verification flow)
        if (!user.isVerified) {
            res.status(403);
            throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
        }

        // If user is admin, require 2FA unless device is trusted
        if (user.isAdmin) {
            // Import models needed for 2FA (lazy import to avoid circular deps)
            const OTP = (await import('../models/OTP.js')).default;
            const TrustedDevice = (await import('../models/TrustedDevice.js')).default;
            const { adminOTPEmailTemplate } = await import('../utils/emailTemplates/adminOTPEmail.js');

            // Check if device is trusted
            if (deviceId) {
                const trustedDevice = await TrustedDevice.findOne({
                    userId: user._id,
                    deviceId,
                    expiresAt: { $gt: Date.now() },
                });

                if (trustedDevice) {
                    // Device is trusted, allow direct login
                    await trustedDevice.updateLastUsed();

                    return res.json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        isAdmin: user.isAdmin,
                        role: user.role,
                        token: generateToken(user._id),
                        trustedDevice: true,
                    });
                }
            }

            // Generate 6-digit OTP
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Save OTP to database
            await OTP.create({
                userId: user._id,
                code: otpCode,
            });

            // Send OTP email
            try {
                await sendEmail({
                    email: user.email,
                    subject: '🔐 Your Admin Login Verification Code',
                    html: adminOTPEmailTemplate(otpCode),
                });

                return res.json({
                    requireOTP: true,
                    message: 'Admin account detected. OTP sent to your email.',
                    email: user.email,
                });
            } catch (error) {
                console.error('Error sending OTP email:', error);

                // In development, show OTP in console if email fails
                if (process.env.NODE_ENV === 'development') {
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('🔐 DEVELOPMENT MODE - OTP CODE:');
                    console.log(`📧 Email: ${user.email}`);
                    console.log(`🔑 OTP: ${otpCode}`);
                    console.log('⏱️  Expires in: 1 minute');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                    return res.json({
                        requireOTP: true,
                        message: 'Admin account detected. OTP logged to server console (dev mode).',
                        email: user.email,
                        devMode: true,
                    });
                }

                res.status(500);
                throw new Error('Failed to send verification code. Please try again.');
            }
        }

        // Regular user login
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            isAdmin: user.isAdmin,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            isAdmin: user.isAdmin,
            role: user.role,
            createdAt: user.createdAt,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.image = req.body.image || user.image;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image,
            isAdmin: updatedUser.isAdmin,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Change user password
// @route   PUT /api/users/password
// @access  Private
const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(oldPassword))) {
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } else {
        res.status(401);
        throw new Error('Invalid old password');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Add movie to favorites
// @route   POST /api/users/favorites
// @access  Private
const addFavoriteMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        if (user.likedMovies.includes(movieId)) {
            res.status(400);
            throw new Error('Movie already in favorites');
        }

        user.likedMovies.push(movieId);
        await user.save();
        res.json(user.likedMovies);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete movie from favorites
// @route   DELETE /api/users/favorites
// @access  Private
const deleteFavoriteMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        user.likedMovies = user.likedMovies.filter(
            (id) => id !== movieId.toString()
        );
        await user.save();
        res.json(user.likedMovies);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get favorite movies
// @route   GET /api/users/favorites
// @access  Private
const getFavoriteMovies = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        // Return array of movieIds (TMDB IDs)
        res.json(user.likedMovies || []);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete all favorite movies
// @route   DELETE /api/users/favorites/all
// @access  Private
const deleteAllFavorites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.likedMovies = [];
        await user.save();
        res.json({ message: 'All favorites cleared', likedMovies: [] });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Forgot Password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Generate token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Reset Password
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;

    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid token');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
        message: 'Password updated success',
    });
});

// @desc    Ban user
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
const banUser = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error('Cannot ban admin user');
        }

        user.banned = true;
        user.bannedReason = reason || 'No reason provided';
        user.bannedAt = Date.now();

        await user.save();
        res.json({ message: 'User banned successfully', user });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Unban user
// @route   PUT /api/users/:id/unban
// @access  Private/Admin
const unbanUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.banned = false;
        user.bannedReason = undefined;
        user.bannedAt = undefined;

        await user.save();
        res.json({ message: 'User unbanned successfully', user });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Change user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const changeUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        if (!['user', 'admin'].includes(role)) {
            res.status(400);
            throw new Error('Invalid role');
        }

        user.role = role;
        user.isAdmin = role === 'admin';

        await user.save();
        res.json({ message: 'User role updated successfully', user });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Verify email with token
// @route   GET /api/users/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    // Get hashed token
    const verificationToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        verificationToken,
        isVerified: false,
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Email verified successfully! You can now log in.',
        email: user.email,
    });
});

// @desc    Resend verification email
// @route   POST /api/users/resend-verification
// @access  Public
const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.isVerified) {
        res.status(400);
        throw new Error('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/verify-email/${verificationToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Verify Your Netflix Account - New Link',
            html: resendVerificationTemplate(user.name, verificationUrl),
        });

        res.status(200).json({
            success: true,
            message: 'Verification email sent! Please check your inbox.',
        });
    } catch (error) {
        res.status(500);
        throw new Error('Could not send verification email. Please try again later.');
    }
});

// @desc    Bulk Ban Users
// @route   POST /api/users/bulk/ban
// @access  Private/Admin
const bulkBanUsers = asyncHandler(async (req, res) => {
    const { userIds, reason } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400);
        throw new Error('Please provide an array of user IDs');
    }

    const result = await User.updateMany(
        { _id: { $in: userIds }, isAdmin: false }, // Don't ban admins
        {
            $set: {
                banned: true,
                bannedReason: reason || 'Bulk ban by admin',
                bannedAt: Date.now(),
            },
        }
    );

    res.json({
        success: true,
        message: `${result.modifiedCount} users banned successfully`,
        modifiedCount: result.modifiedCount,
    });
});

// @desc    Bulk Delete Users
// @route   POST /api/users/bulk/delete
// @access  Private/Admin
const bulkDeleteUsers = asyncHandler(async (req, res) => {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400);
        throw new Error('Please provide an array of user IDs');
    }

    const result = await User.deleteMany({
        _id: { $in: userIds },
        isAdmin: false, // Don't delete admins
    });

    res.json({
        success: true,
        message: `${result.deletedCount} users deleted successfully`,
        deletedCount: result.deletedCount,
    });
});

// @desc    Bulk Approve Users
// @route   POST /api/users/bulk/approve
// @access  Private/Admin
const bulkApproveUsers = asyncHandler(async (req, res) => {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400);
        throw new Error('Please provide an array of user IDs');
    }

    const result = await User.updateMany(
        { _id: { $in: userIds }, accountStatus: 'pending' },
        {
            $set: {
                accountStatus: 'active',
                isVerified: true,
                approvedAt: Date.now(),
            },
        }
    );

    res.json({
        success: true,
        message: `${result.modifiedCount} users approved successfully`,
        modifiedCount: result.modifiedCount,
    });
});

// @desc    Export Users to CSV
// @route   GET /api/users/export
// @access  Private/Admin
const exportUsers = asyncHandler(async (req, res) => {
    const { status, role, startDate, endDate } = req.query;

    const query = {};

    if (status) query.accountStatus = status;
    if (role) query.role = role;
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const users = await User.find(query)
        .select('name email role accountStatus isVerified createdAt banned')
        .lean();

    // Create CSV
    const csvHeader = 'ID,Name,Email,Role,Status,Verified,Created At,Banned\n';
    const csvRows = users.map(user => {
        return [
            user._id,
            user.name,
            user.email,
            user.role,
            user.accountStatus,
            user.isVerified,
            new Date(user.createdAt).toISOString(),
            user.banned || false,
        ].join(',');
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=users-export-${Date.now()}.csv`);
    res.send(csv);
});

// @desc    Get User Activity Log
// @route   GET /api/users/:id/activity
// @access  Private/Admin
const getUserActivityLog = asyncHandler(async (req, res) => {
    const { getUserActivities } = await import('../utils/activityLogger.js');

    const activities = await getUserActivities(req.params.id, {
        limit: parseInt(req.query.limit) || 50,
        page: parseInt(req.query.page) || 1,
        action: req.query.action,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
    });

    res.json(activities);
});

export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
    getUsers,
    deleteUser,
    banUser,
    unbanUser,
    changeUserRole,
    addFavoriteMovie,
    deleteFavoriteMovie,
    deleteAllFavorites,
    getFavoriteMovies,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    // Bulk operations
    bulkBanUsers,
    bulkDeleteUsers,
    bulkApproveUsers,
    exportUsers,
    getUserActivityLog,
};

// Import registration controller functions
export {
    getPendingRegistrations,
    approveRegistration,
    rejectRegistration,
    verifyCode,
    resendVerificationCode
} from './registrationController.js';
