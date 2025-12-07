import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        image: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        banned: {
            type: Boolean,
            default: false,
        },
        bannedReason: {
            type: String,
        },
        bannedAt: {
            type: Date,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        likedMovies: [
            {
                type: String, // Store TMDB movie ID as string
            },
        ],
        // Account status for admin approval flow
        accountStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'active'],
            default: 'pending',
        },
        verificationCode: String,
        verificationCodeExpires: Date,
        codeAttempts: {
            type: Number,
            default: 0,
        },
        lastCodeSentAt: Date,
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        approvedAt: Date,
        rejectionReason: String,
        rejectedAt: Date,
        // For email verification and password reset
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        // For admin approval via email link
        approvalToken: String,
        approvalTokenExpires: Date,
    },
    {
        timestamps: true,
    }
);

// Pre-save middleware: sync role/isAdmin and hash password
userSchema.pre('save', async function () {
    // 1. Sync role and isAdmin fields
    if (this.isModified('role')) {
        this.isAdmin = this.role === 'admin';
    } else if (this.isModified('isAdmin')) {
        this.role = this.isAdmin ? 'admin' : 'user';
    }

    // 2. Encrypt password using bcrypt
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// Generate and hash verification token
userSchema.methods.generateVerificationToken = function () {
    // Generate token
    const verifyToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to verificationToken field
    this.verificationToken = crypto
        .createHash('sha256')
        .update(verifyToken)
        .digest('hex');

    return verifyToken;
};

// Generate 6-digit verification code for admin-approved registration
userSchema.methods.generateRegistrationCode = function () {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    this.verificationCode = code;
    this.verificationCodeExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    this.codeAttempts = 0;
    this.lastCodeSentAt = Date.now();

    return code;
};

// Validate verification code
userSchema.methods.validateRegistrationCode = function (code) {
    if (!this.verificationCode) {
        return { valid: false, error: 'No verification code found' };
    }

    if (this.verificationCodeExpires < Date.now()) {
        return { valid: false, error: 'Verification code has expired' };
    }

    if (this.codeAttempts >= 5) {
        return { valid: false, error: 'Too many failed attempts. Request a new code.' };
    }

    if (this.verificationCode !== code) {
        this.codeAttempts += 1;
        return { valid: false, error: 'Invalid verification code' };
    }

    return { valid: true };
};

// Clear verification code after use
userSchema.methods.clearRegistrationCode = function () {
    this.verificationCode = undefined;
    this.verificationCodeExpires = undefined;
    this.codeAttempts = 0;
};

// Generate approval token for admin email approval
userSchema.methods.generateApprovalToken = function () {
    // Generate token
    const approvalToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to approvalToken field
    this.approvalToken = crypto
        .createHash('sha256')
        .update(approvalToken)
        .digest('hex');

    // Set expire to 24 hours
    this.approvalTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    return approvalToken;
};

// Verify and approve user by token
userSchema.methods.verifyApprovalToken = function (token) {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    if (this.approvalToken !== hashedToken) {
        return { valid: false, error: 'Invalid approval token' };
    }

    if (this.approvalTokenExpires < Date.now()) {
        return { valid: false, error: 'Approval link has expired' };
    }

    return { valid: true };
};

// ============================================
// DATABASE INDEXES FOR PERFORMANCE
// ============================================

// Email index (unique already creates index, but explicit for clarity)
userSchema.index({ email: 1 });

// Verification token index
userSchema.index({ verificationToken: 1 });

// Reset password token index
userSchema.index({ resetPasswordToken: 1 });

// Admin/Role queries
userSchema.index({ isAdmin: 1 });
userSchema.index({ role: 1 });

// Premium users query
userSchema.index({ isPremium: 1 });

// Banned users query
userSchema.index({ banned: 1 });

const User = mongoose.model('User', userSchema);

export default User;
