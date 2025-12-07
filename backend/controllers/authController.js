import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import TrustedDevice from '../models/TrustedDevice.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { adminApprovalEmailTemplate, userApprovedEmailTemplate } from '../utils/emailTemplates/adminApprovalEmail.js';
import { adminOTPEmailTemplate } from '../utils/emailTemplates/adminOTPEmail.js';
import crypto from 'crypto';

export const approveUserByToken = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const users = await User.find({
        approvalToken: { $exists: true },
        approvalTokenExpires: { $gt: Date.now() }
    });

    let approvedUser = null;
    for (const user of users) {
        const verification = user.verifyApprovalToken(token);
        if (verification.valid) {
            approvedUser = user;
            break;
        }
    }

    if (!approvedUser) {
        res.status(400);
        throw new Error('Invalid or expired approval link');
    }

    approvedUser.accountStatus = 'active';
    approvedUser.isVerified = true;
    approvedUser.approvalToken = undefined;
    approvedUser.approvalTokenExpires = undefined;
    approvedUser.approvedAt = Date.now();

    await approvedUser.save();

    try {
        await sendEmail({
            email: approvedUser.email,
            subject: '✅ Your Netflixfake Account Has Been Approved!',
            html: userApprovedEmailTemplate(approvedUser.name),
        });
    } catch (error) {
        console.error('Error sending approval confirmation email:', error);
    }

    res.status(200).json({
        success: true,
        message: 'User approved successfully! They can now log in.',
        user: {
            name: approvedUser.name,
            email: approvedUser.email,
        },
    });
});

export const loginAdmin2FA = asyncHandler(async (req, res) => {
    const { email, password, deviceId } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    if (!user.isAdmin) {
        res.status(403);
        throw new Error('This endpoint is for admin login only');
    }

    if (user.banned) {
        res.status(403);
        throw new Error(`Account banned: ${user.bannedReason || 'Violation of terms'}`);
    }

    if (deviceId) {
        const trustedDevice = await TrustedDevice.findOne({
            userId: user._id,
            deviceId,
            expiresAt: { $gt: Date.now() },
        });

        if (trustedDevice) {
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

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({
        userId: user._id,
        code: otpCode,
    });

    try {
        await sendEmail({
            email: user.email,
            subject: '🔐 Your Admin Login Verification Code',
            html: adminOTPEmailTemplate(otpCode),
        });

        res.json({
            requireOTP: true,
            message: 'OTP sent to your email. Please check your inbox.',
            email: user.email,
        });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500);
        throw new Error('Failed to send verification code. Please try again.');
    }
});

export const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp, trustDevice, deviceId, deviceInfo } = req.body;

    const user = await User.findOne({ email, isAdmin: true });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const otpRecord = await OTP.findOne({
        userId: user._id,
        code: otp,
        expiresAt: { $gt: Date.now() },
    });

    if (!otpRecord) {
        res.status(401);
        throw new Error('Invalid or expired OTP code');
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    if (trustDevice && deviceId) {
        await TrustedDevice.findOneAndUpdate(
            { userId: user._id, deviceId },
            {
                userId: user._id,
                deviceId,
                deviceInfo: deviceInfo || {},
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                lastUsed: Date.now(),
            },
            { upsert: true, new: true }
        );
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        role: user.role,
        token: generateToken(user._id),
        deviceTrusted: trustDevice,
    });
});

export const verifyRegistrationOTP = asyncHandler(async (req, res) => {
    const { userId, email, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.isVerified && user.accountStatus === 'active') {
        res.status(400);
        throw new Error('Account already verified');
    }

    const otpRecord = await OTP.findOne({
        userId: user._id,
        code: otp,
        expiresAt: { $gt: Date.now() },
    });

    if (!otpRecord) {
        res.status(401);
        throw new Error('Invalid or expired OTP code');
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    user.isVerified = true;
    user.accountStatus = 'active';
    await user.save();

    res.json({
        success: true,
        message: 'Email verified successfully! You can now login.',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            token: generateToken(user._id),
        },
    });
});

export const getAdminEmail = asyncHandler(async (req, res) => {
    const admin = await User.findOne({ isAdmin: true }).select('email');

    if (!admin) {
        res.status(404);
        throw new Error('No admin user found');
    }

    res.json({ email: admin.email });
});
