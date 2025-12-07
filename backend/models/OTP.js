import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 60000), // 1 minute from now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120, // Auto-delete after 2 minutes (TTL index)
    },
});

// Index for faster lookups
otpSchema.index({ userId: 1, code: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate and save OTP
otpSchema.statics.generateOTP = async function (userId, email) {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this user
    await this.deleteMany({ userId });

    // Create new OTP
    await this.create({
        userId,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    return code;
};

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
