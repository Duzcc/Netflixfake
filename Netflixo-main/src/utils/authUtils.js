import api from './api';

// ==================== Session Management ====================

/**
 * Get the currently logged-in user
 * @returns {Object|null} User object or null if not logged in
 */
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;

        const user = JSON.parse(userStr);

        // Ensure role is set correctly for admins
        if (user.isAdmin && !user.role) {
            user.role = 'admin';
        }

        return user;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
};

/**
 * Check if a user is currently authenticated
 * @returns {boolean} True if user is logged in
 */
export const isAuthenticated = () => {
    return getCurrentUser() !== null;
};

/**
 * Check if the current user is an admin
 * @returns {boolean} True if user is admin
 */
export const isAdmin = () => {
    const user = getCurrentUser();
    return user?.isAdmin === true || user?.role === 'admin';
};

/**
 * Save user session to localStorage
 * @param {Object} userData - User data to save
 */
export const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new Event("userLoggedIn"));
};

/**
 * Clear user session from localStorage
 */
export const logout = () => {
    localStorage.removeItem("user");
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new Event("userLoggedOut"));
};

/**
 * Update user profile
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} { success: boolean, error: string }
 */
export const updateUserProfile = async (updates) => {
    try {
        const { data } = await api.put('/users/profile', updates);

        // Update local storage with new user data (keeping the token)
        const currentUser = getCurrentUser();
        const updatedUser = { ...currentUser, ...data };
        // If the API returns a new token, use it, otherwise keep the old one
        if (data.token) {
            updatedUser.token = data.token;
        }

        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userProfileUpdated"));

        return { success: true, error: "" };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Failed to update profile"
        };
    }
};

/**
 * Update user password
 * @param {string} currentPassword - Current password for verification
 * @param {string} newPassword - New password to set
 * @returns {Promise<Object>} { success: boolean, error: string }
 */
export const updatePassword = async (currentPassword, newPassword) => {
    try {
        await api.put('/users/password', {
            oldPassword: currentPassword,
            newPassword
        });
        return { success: true, error: "" };
    } catch (error) {
        console.error("Error updating password:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Failed to update password"
        };
    }
};

// ==================== Validation Functions ====================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
    if (!email || email.trim() === "") {
        return { isValid: false, error: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: "Please enter a valid email address" };
    }

    return { isValid: true, error: "" };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePassword = (password) => {
    if (!password || password.trim() === "") {
        return { isValid: false, error: "Password is required" };
    }

    if (password.length < 6) {
        return { isValid: false, error: "Password must be at least 6 characters long" };
    }

    return { isValid: true, error: "" };
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = "This field") => {
    if (!value || value.trim() === "") {
        return { isValid: false, error: `${fieldName} is required` };
    }

    return { isValid: true, error: "" };
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return { isValid: false, error: "Passwords do not match" };
    }

    return { isValid: true, error: "" };
};

// ==================== User Management ====================

/**
 * Register a new user
 * @param {Object} userData - User data { name, email, password, image }
 * @returns {Promise<Object>} { success: boolean, error: string }
 */
export const registerUser = async (userData) => {
    try {
        const { data } = await api.post('/users', userData);
        return {
            success: !data.requireOTP,
            requireOTP: data.requireOTP || false,
            userId: data.userId,
            email: data.email,
            error: ""
        };
    } catch (error) {
        console.error("Error registering user:", error);
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);

        return {
            success: false,
            requireOTP: false,
            error: error.response?.data?.message || error.response?.data?.error || "Registration failed"
        };
    }
};

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} { success: boolean, requireOTP: boolean, user: Object|null, error: string, email: string }
 */
export const authenticateUser = async (email, password) => {
    try {
        const { data } = await api.post('/users/login', { email, password });

        // Check if OTP is required (admin user with 2FA)
        if (data.requireOTP) {
            return {
                success: false,
                requireOTP: true,
                email: data.email || email,
                message: data.message,
                error: ''
            };
        }

        // Regular user - login directly
        login(data);
        return { success: true, requireOTP: false, user: data, error: "" };
    } catch (error) {
        console.error("Error authenticating user:", error);
        return {
            success: false,
            requireOTP: false,
            user: null,
            error: error.response?.data?.message || "Invalid email or password"
        };
    }
};

// ==================== Favorites Management ====================

/**
 * Get user's favorite movies
 * @returns {Promise<Array>} List of favorite movies
 */
export const getFavorites = async () => {
    try {
        const { data } = await api.get('/users/favorites');
        return data;
    } catch (error) {
        console.error("Error getting favorites:", error);
        return [];
    }
};

/**
 * Add movie to favorites
 * @param {string} movieId - ID of the movie to add
 * @returns {Promise<boolean>} Success status
 */
export const addFavorite = async (movieId) => {
    try {
        const { data } = await api.post('/users/favorites', { movieId });

        // Update local user data
        const currentUser = getCurrentUser();
        if (currentUser) {
            currentUser.likedMovies = data;
            localStorage.setItem("user", JSON.stringify(currentUser));
            window.dispatchEvent(new Event("favoritesUpdated"));
        }
        return true;
    } catch (error) {
        console.error("Error adding favorite:", error);
        return false;
    }
};

/**
 * Remove movie from favorites
 * @param {string} movieId - ID of the movie to remove
 * @returns {Promise<boolean>} Success status
 */
export const removeFavorite = async (movieId) => {
    try {
        const { data } = await api.delete('/users/favorites', { data: { movieId } });

        // Update local user data
        const currentUser = getCurrentUser();
        if (currentUser) {
            currentUser.likedMovies = data;
            localStorage.setItem("user", JSON.stringify(currentUser));
            window.dispatchEvent(new Event("favoritesUpdated"));
        }
        return true;
    } catch (error) {
        console.error("Error removing favorite:", error);
        return false;
    }
};

/**
 * Clear all favorites
 * @returns {Promise<Object>} { success: boolean, error: string }
 */
export const clearAllFavorites = async () => {
    try {
        await api.delete('/users/favorites/all');

        // Update local user data
        const currentUser = getCurrentUser();
        if (currentUser) {
            currentUser.likedMovies = [];
            localStorage.setItem("user", JSON.stringify(currentUser));
            window.dispatchEvent(new Event("favoritesUpdated"));
        }
        return { success: true, error: "" };
    } catch (error) {
        console.error("Error clearing all favorites:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Failed to clear favorites"
        };
    }
};

/**
 * Check if movie is in favorites
 * @param {string} movieId - ID of the movie to check
 * @returns {boolean} True if movie is in favorites
 */
export const isFavorite = (movieId) => {
    const user = getCurrentUser();
    return user?.likedMovies?.includes(movieId) || false;
};

// ==================== Image Utilities ====================

/**
 * Convert file to base64 string
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 encoded image
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateImageFile = (file) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (!file) {
        return { isValid: false, error: "No file selected" };
    }

    if (!allowedTypes.includes(file.type)) {
        return { isValid: false, error: "Only JPG, PNG, and GIF images are allowed" };
    }

    if (file.size > maxSize) {
        return { isValid: false, error: "Image size must be less than 2MB" };
    }

    return { isValid: true, error: "" };
};
