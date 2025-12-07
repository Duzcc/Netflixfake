import express from 'express';
import {
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
    // Admin registration
    getPendingRegistrations,
    approveRegistration,
    rejectRegistration,
    verifyCode,
    resendVerificationCode,
    // Bulk operations
    bulkBanUsers,
    bulkDeleteUsers,
    bulkApproveUsers,
    exportUsers,
    getUserActivityLog,
} from '../controllers/userController.js';
import {
    approveUserByToken,
    loginAdmin2FA,
    verifyOTP,
    verifyRegistrationOTP
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRegistration, validateLogin, sanitizeInput } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

// Public routes
router.post('/', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Admin 2FA routes
router.post('/admin/login-2fa', loginAdmin2FA);
router.post('/admin/verify-otp', verifyOTP);

// User registration OTP verification
router.post('/verify-registration-otp', verifyRegistrationOTP);

// Email verification (old flow - kept for compatibility)
router.post('/verify-code', verifyCode);
router.post('/resend-code', resendVerificationCode);

// Bulk operations (Admin only)
router.post('/bulk/ban', protect, admin, bulkBanUsers);
router.post('/bulk/delete', protect, admin, bulkDeleteUsers);
router.post('/bulk/approve', protect, admin, bulkApproveUsers);

// Export users (Admin only)
router.get('/export', protect, admin, exportUsers);

// User activity log
router.get('/:id/activity', protect, admin, getUserActivityLog);

// Private routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.put('/password', protect, changeUserPassword);

router.route('/favorites')
    .get(protect, getFavoriteMovies)
    .post(protect, addFavoriteMovie)
    .delete(protect, deleteFavoriteMovie);

router.delete('/favorites/all', protect, deleteAllFavorites);

// Admin registration management routes
router.get('/registrations/pending', protect, admin, getPendingRegistrations);
router.post('/registrations/:id/approve', protect, admin, approveRegistration);
router.post('/registrations/:id/reject', protect, admin, rejectRegistration);

// Admin routes
router.route('/')
    .get(protect, admin, getUsers);

router.route('/:id')
    .delete(protect, admin, deleteUser);

router.put('/:id/ban', protect, admin, banUser);
router.put('/:id/unban', protect, admin, unbanUser);
router.put('/:id/role', protect, admin, changeUserRole);

export default router;
