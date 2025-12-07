import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import {
  validateEmail,
  validateRequired,
  authenticateUser,
  login,
} from "../utils/authUtils";
import OTPModal from "../Components/Modals/OTPModal";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.registered) {
      // Could show a toast notification instead
      console.log("Registration successful! Please login.");
    }
  }, [location.state]);

  const validateForm = () => {
    const newErrors = {};

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    const passwordValidation = validateRequired(password, "Password");
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await authenticateUser(email, password);

    setIsLoading(false);

    if (result.requireOTP) {
      // Admin user - show OTP modal
      setShowOTPModal(true);
      setAdminEmail(result.email || email);
    } else if (result.success) {
      // Regular user - login and redirect
      login(result.user);

      // Redirect based on role
      if (result.user.isAdmin || result.user.role === 'admin') {
        navigate('/dashboard'); // Admin dashboard
      } else {
        navigate('/'); // Home
      }
    } else {
      setErrors({ general: result.error });

      if (result.error && result.error.toLowerCase().includes("verify")) {
        setShowResendVerification(true);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setErrors({ general: "Please enter your email address" });
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch("http://localhost:5001/api/users/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setErrors({ success: data.message || "Verification email sent! Please check your inbox." });
        setShowResendVerification(false);
      } else {
        setErrors({ general: data.message || "Failed to send verification email" });
      }
    } catch (error) {
      setErrors({ general: "Error sending verification email. Please try again." });
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-main flex items-center justify-center relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-subMain/10 via-transparent to-transparent" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-subMain/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-subMain/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-12 relative z-10">
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
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-text-secondary">Sign in to continue watching</p>
          </motion.div>

          {/* Form Card */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleLogin}
            className="glass-card backdrop-blur-xl p-8 rounded-2xl border border-white/10 space-y-6"
          >
            {/* Success Message */}
            {errors.success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-success/20 border border-success/50 rounded-lg text-success text-sm"
              >
                {errors.success}
              </motion.div>
            )}

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

            {/* Sign In Button */}
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
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FiLogIn />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>

            {/* Resend Verification */}
            {showResendVerification && (
              <motion.button
                type="button"
                onClick={handleResendVerification}
                disabled={isResending}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`w-full glass-dark backdrop-blur-md text-white font-semibold py-3 rounded-lg border-2 border-subMain/50 hover:bg-subMain/20 transition-all duration-300 text-sm ${isResending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {isResending ? "Sending..." : "📧 Resend Verification Email"}
              </motion.button>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-text-secondary text-sm">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-text-secondary">
              New to Netflixfake?{" "}
              <Link
                to="/register"
                className="text-subMain hover:text-white font-semibold transition-colors"
              >
                Sign up now
              </Link>
            </p>
          </motion.form>

          {/* Additional Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-text-secondary text-xs mt-6"
          >
            This page is protected by reCAPTCHA and the Netflix Privacy Policy
          </motion.p>
        </motion.div>

        {/* OTP Modal for Admin 2FA */}
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          email={adminEmail}
          onSuccess={(userData) => {
            login(userData);
            navigate('/dashboard'); // Redirect to admin dashboard
          }}
        />
      </div>
    </div>
  );
}

export default Login;
