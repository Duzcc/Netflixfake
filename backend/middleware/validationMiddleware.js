// Validation middleware for common inputs
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // At least 6 characters
    return password && password.length >= 6;
};

const validateRating = (rating) => {
    const num = Number(rating);
    return !isNaN(num) && num >= 1 && num <= 10;
};

const validateTMDBId = (id) => {
    const num = Number(id);
    return !isNaN(num) && num > 0;
};

// ============================================
// USER VALIDATION
// ============================================

// Registration validation
const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!validateEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    if (!validatePassword(password)) {
        errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors,
        });
    }

    next();
};

// Login validation
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!validateEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    if (!password) {
        errors.push('Please provide a password');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors,
        });
    }

    next();
};

// ============================================
// MOVIE VALIDATION
// ============================================

// Movie validation
const validateMovie = (req, res, next) => {
    const { name, desc, category, language, year, time } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Movie name must be at least 2 characters long');
    }

    if (!desc || desc.trim().length < 10) {
        errors.push('Movie description must be at least 10 characters long');
    }

    if (!category || category.trim().length === 0) {
        errors.push('Category is required');
    }

    if (!language || language.trim().length === 0) {
        errors.push('Language is required');
    }

    if (!year || year < 1900 || year > new Date().getFullYear() + 5) {
        errors.push('Invalid year');
    }

    if (!time || time <= 0) {
        errors.push('Runtime must be greater than 0');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors,
        });
    }

    next();
};

// Review validation
const validateReview = (req, res, next) => {
    const { rating, comment } = req.body;
    const errors = [];

    if (!rating || rating < 1 || rating > 10) {
        errors.push('Rating must be between 1 and 10');
    }

    if (!comment || comment.trim().length < 5) {
        errors.push('Comment must be at least 5 characters long');
    }

    if (comment && comment.length > 500) {
        errors.push('Comment cannot exceed 500 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors,
        });
    }

    next();
};

// TMDb ID validation
const validateTmdbId = (req, res, next) => {
    const { tmdbId } = req.body;

    if (!tmdbId) {
        return res.status(400).json({
            success: false,
            error: 'TMDb ID is required',
        });
    }

    if (!validateTMDBId(tmdbId)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid TMDb ID',
        });
    }

    next();
};

// Movie ID parameter validation
const validateMovieId = (req, res, next) => {
    const { id } = req.params;

    // For MongoDB ObjectId or TMDb ID
    if (!id || id.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Movie ID is required',
        });
    }

    next();
};

// ============================================
// GENERAL SANITIZATION
// ============================================

// General sanitization middleware
const sanitizeInput = (req, res, next) => {
    // Sanitize all string inputs in body
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }

    // Sanitize query parameters
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        });
    }

    next();
};

export {
    validateRegistration,
    validateLogin,
    validateMovie,
    validateReview,
    validateTmdbId,
    validateMovieId,
    sanitizeInput,
    validateEmail,
    validatePassword,
    validateRating,
    validateTMDBId,
};
