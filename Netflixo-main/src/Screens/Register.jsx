import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validatePasswordMatch,
  registerUser,
  login,
} from "../utils/authUtils";
import OTPModal from "../Components/Modals/OTPModal";
import axios from 'axios';

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    const nameValidation = validateRequired(fullName, "Full name");
    if (!nameValidation.isValid) {
      newErrors.fullName = nameValidation.error;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
    if (!passwordMatchValidation.isValid) {
      newErrors.confirmPassword = passwordMatchValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await registerUser({
      name: fullName,
      email,
      password,
      image: null,
    });

    setIsLoading(false);

    if (result.requireOTP) {
      // Show OTP modal for email verification
      setRegistrationData({
        userId: result.userId,
        email: result.email || email,
        name: fullName,
      });
      setShowOTPModal(true);
    } else if (result.success) {
      // Auto-approved (dev mode without email)
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/");
    } else {
      setErrors({ general: result.error });
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return null;
    const strength = validatePassword(password);
    if (password.length < 6) return { level: "weak", color: "error", text: "Weak" };
    if (password.length < 10) return { level: "medium", color: "warning", text: "Medium" };
    return { level: "strong", color: "success", text: "Strong" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-main flex items-center justify-center relative overflow-hidden py-12">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-subMain/10 via-transparent to-transparent" />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-subMain/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-subMain/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <img
              src="/favicon.png"
              alt="Netflixfake"
              className="h-16 mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-text-secondary">Join thousands of movie lovers</p>
          </motion.div>

          {/* Form Card */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleRegister}
            className="glass-card backdrop-blur-xl p-8 rounded-2xl border border-white/10 space-y-6"
          >
            {/* Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-error/20 border border-error/50 rounded-lg text-error text-sm"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Full Name Input */}
            <div className="relative">
              <div
                className={`relative flex items-center glass-dark backdrop-blur-md rounded-lg border-2 transition-all duration-300 ${errors.fullName
                  ? "border-error"
                  : focusedField === "fullName"
                    ? "border-subMain shadow-glow"
                    : "border-white/20 hover:border-white/40"
                  }`}
              >
                <FiUser className="absolute left-4 text-text-secondary text-lg" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder=" "
                  className="w-full bg-transparent text-white pl-12 pr-4 py-4 outline-none peer"
                />
                <label
                  className={`absolute left-12 transition-all duration-200 pointer-events-none ${focusedField === "fullName" || fullName
                    ? "-top-2 text-xs bg-main px-2 text-subMain"
                    : "top-4 text-sm text-text-secondary"
                    }`}
                >
                  Full Name
                </label>
              </div>
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-error text-xs mt-1 ml-1"
                >
                  {errors.fullName}
                </motion.p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative">
              <div
                className={`relative flex items-center glass-dark backdrop-blur-md rounded-lg border-2 transition-all duration-300 ${errors.email
                  ? "border-error"
                  : focusedField === "email"
                    ? "border-subMain shadow-glow"
                    : "border-white/20 hover:border-white/40"
                  }`}
              >
                <FiMail className="absolute left-4 text-text-secondary text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder=" "
                  className="w-full bg-transparent text-white pl-12 pr-4 py-4 outline-none peer"
                />
                <label
                  className={`absolute left-12 transition-all duration-200 pointer-events-none ${focusedField === "email" || email
                    ? "-top-2 text-xs bg-main px-2 text-subMain"
                    : "top-4 text-sm text-text-secondary"
                    }`}
                >
                  Email Address
                </label>
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-error text-xs mt-1 ml-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <div
                className={`relative flex items-center glass-dark backdrop-blur-md rounded-lg border-2 transition-all duration-300 ${errors.password
                  ? "border-error"
                  : focusedField === "password"
                    ? "border-subMain shadow-glow"
                    : "border-white/20 hover:border-white/40"
                  }`}
              >
                <FiLock className="absolute left-4 text-text-secondary text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder=" "
                  className="w-full bg-transparent text-white pl-12 pr-12 py-4 outline-none peer"
                />
                <label
                  className={`absolute left-12 transition-all duration-200 pointer-events-none ${focusedField === "password" || password
                    ? "-top-2 text-xs bg-main px-2 text-subMain"
                    : "top-4 text-sm text-text-secondary"
                    }`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-text-secondary hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {password && passwordStrength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          passwordStrength.level === "weak"
                            ? "33%"
                            : passwordStrength.level === "medium"
                              ? "66%"
                              : "100%",
                      }}
                      className={`h-full bg-${passwordStrength.color}`}
                    />
                  </div>
                  <span className={`text-xs text-${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-error text-xs mt-1 ml-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div
                className={`relative flex items-center glass-dark backdrop-blur-md rounded-lg border-2 transition-all duration-300 ${errors.confirmPassword
                  ? "border-error"
                  : focusedField === "confirmPassword"
                    ? "border-subMain shadow-glow"
                    : "border-white/20 hover:border-white/40"
                  }`}
              >
                <FiCheck className="absolute left-4 text-text-secondary text-lg" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  placeholder=" "
                  className="w-full bg-transparent text-white pl-12 pr-12 py-4 outline-none peer"
                />
                <label
                  className={`absolute left-12 transition-all duration-200 pointer-events-none ${focusedField === "confirmPassword" || confirmPassword
                    ? "-top-2 text-xs bg-main px-2 text-subMain"
                    : "top-4 text-sm text-text-secondary"
                    }`}
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-text-secondary hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-error text-xs mt-1 ml-1"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Sign Up Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-subMain text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 ${isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-subMain/90 shadow-glow"
                }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FiCheck />
                  <span>Create Account</span>
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-text-secondary text-sm">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Sign In Link */}
            <p className="text-center text-text-secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-subMain hover:text-white font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.form>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-text-secondary text-xs mt-6"
          >
            By signing up, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </motion.div>

        {/* OTP Verification Modal */}
        {registrationData && (
          <OTPModal
            isOpen={showOTPModal}
            onClose={() => setShowOTPModal(false)}
            email={registrationData.email}
            onSuccess={async (userData) => {
              // User verified via OTPModal, but for registration we need custom flow
              // Close modal and show success, then redirect
              setShowOTPModal(false);

              // Clear form
              setFullName("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");

              // Login user with returned data
              if (userData && userData.token) {
                login(userData);
                navigate("/");
              } else {
                // Redirect to login if no token
                navigate("/login?verified=true");
              }
            }}
            // Override verify endpoint for registration
            customVerifyEndpoint="/users/verify-registration-otp"
            customVerifyData={{
              userId: registrationData.userId,
              email: registrationData.email,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Register;
