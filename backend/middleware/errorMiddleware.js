// Centralized error handling middleware

import { AppError } from '../utils/errors.js';

// Not found middleware
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Enhanced Error handler middleware
const errorHandler = (err, req, res, next) => {
    // Determine status code
    let statusCode = err.statusCode || res.statusCode || 500;

    // Ensure statusCode is not 200
    if (statusCode === 200) {
        statusCode = 500;
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('🔥 ERROR OCCURRED:');
        console.error('Message:', err.message);
        console.error('Status Code:', statusCode);
        console.error('Stack:', err.stack);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    // Prepare error response
    const response = {
        status: err.status || 'error',
        message: err.message || 'Something went wrong',
        statusCode,
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
        response.error = {
            name: err.name,
            isOperational: err.isOperational,
        };
    }

    // Handle specific error types

    // MongoDB Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 422;
        response.message = 'Validation Error';
        response.errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message,
        }));
    }

    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern)[0];
        response.message = `${field} already exists`;
        response.field = field;
    }

    // MongoDB Cast Error (Invalid ID)
    if (err.name === 'CastError') {
        statusCode = 400;
        response.message = `Invalid ${err.path}: ${err.value}`;
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        response.message = 'Invalid token. Please log in again.';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        response.message = 'Token expired. Please log in again.';
    }

    // Send response
    res.status(statusCode).json(response);
};

// Async handler wrapper to catch errors in async routes
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export { notFound, errorHandler, asyncHandler };
