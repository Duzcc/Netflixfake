import mongoose from 'mongoose';

const trustedDeviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deviceId: {
        type: String,
        required: true,
        unique: true,
    },
    deviceInfo: {
        browser: String,
        os: String,
        ip: String,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    lastUsed: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for faster lookups and auto-expiry
trustedDeviceSchema.index({ userId: 1, deviceId: 1 });
trustedDeviceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Update lastUsed on access
trustedDeviceSchema.methods.updateLastUsed = async function () {
    this.lastUsed = new Date();
    return this.save();
};

const TrustedDevice = mongoose.model('TrustedDevice', trustedDeviceSchema);

export default TrustedDevice;
