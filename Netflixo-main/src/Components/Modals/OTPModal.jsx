import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShield, FiCheck } from 'react-icons/fi';
import axios from 'axios';

function OTPModal({
    isOpen,
    onClose,
    email,
    onSuccess,
    customVerifyEndpoint = null,
    customVerifyData = null,
}) {
    const [otp, setOtp] = useState('');
    const [trustDevice, setTrustDevice] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter a 6-digit code');
            return;
        }

        setIsVerifying(true);

        try {
            // Use custom endpoint if provided (for registration), otherwise use admin endpoint
            const endpoint = customVerifyEndpoint || '/users/admin/verify-otp';
            const requestData = customVerifyData ? {
                ...customVerifyData,
                otp,
            } : {
                email,
                otp,
                trustDevice
            };

            const response = await axios.post(`http://localhost:5001/api${endpoint}`, requestData);

            // Handle response - works for both admin and registration
            const responseData = response.data.user || response.data;

            if (responseData.token || response.data.token) {
                // Store token and user info
                const userData = {
                    ...responseData,
                    token: responseData.token || response.data.token,
                };
                localStorage.setItem('userInfo', JSON.stringify(userData));
                onSuccess(userData);
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP code. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleOTPChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
        if (error) setError('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-main border-2 border-border rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-subMain/20 rounded-full">
                                    <FiShield className="text-subMain text-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Email Verification</h2>
                                    <p className="text-sm text-text">Enter verification code</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Info */}
                        <p className="text-text mb-6">
                            Enter the 6-digit verification code sent to{' '}
                            <span className="text-subMain font-semibold">{email}</span>
                        </p>

                        {/* Dev Mode Notice */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-3"
                        >
                            <span className="text-yellow-500 text-xl">💡</span>
                            <div className="flex-1">
                                <p className="text-yellow-500 font-semibold text-sm mb-1">Development Mode</p>
                                <p className="text-yellow-500/80 text-xs">
                                    Check your email or server terminal/console for the OTP code
                                </p>
                            </div>
                        </motion.div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-error/20 border border-error/50 rounded-lg p-3 mb-4 text-error text-sm flex items-center gap-2"
                                >
                                    <span>⚠️</span>
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* OTP Input Form */}
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={handleOTPChange}
                                    placeholder="000000"
                                    className="w-full bg-dry border-2 border-border focus:border-subMain rounded-lg px-6 py-4 text-white text-center text-3xl tracking-[1em] font-bold outline-none transition-all"
                                    maxLength={6}
                                    autoFocus
                                    required
                                />
                                <p className="text-xs text-text mt-2 text-center">
                                    {6 - otp.length} digits remaining
                                </p>
                            </div>

                            {/* Trust Device Checkbox - only for admin */}
                            {!customVerifyEndpoint && (
                                <label className="flex items-center gap-3 text-text cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={trustDevice}
                                            onChange={(e) => setTrustDevice(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-5 h-5 border-2 border-border rounded peer-checked:bg-subMain peer-checked:border-subMain transition-all flex items-center justify-center">
                                            {trustDevice && <FiCheck className="text-white" size={14} />}
                                        </div>
                                    </div>
                                    <span className="text-sm group-hover:text-white transition-colors">
                                        Trust this device for 30 days
                                    </span>
                                </label>
                            )}

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isVerifying || otp.length !== 6}
                                whileHover={!isVerifying && otp.length === 6 ? { scale: 1.02 } : {}}
                                whileTap={!isVerifying && otp.length === 6 ? { scale: 0.98 } : {}}
                                className={`w-full py-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-3 ${isVerifying || otp.length !== 6
                                        ? 'bg-border cursor-not-allowed opacity-50'
                                        : 'bg-subMain hover:bg-subMain/90 shadow-lg shadow-subMain/50'
                                    }`}
                            >
                                {isVerifying ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiShield />
                                        <span>Verify & Continue</span>
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Help Text */}
                        <p className="text-center text-text text-xs mt-6">
                            Didn't receive the code?{' '}
                            <button className="text-subMain hover:text-white transition-colors font-semibold">
                                Resend
                            </button>
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default OTPModal;
