import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import moderationRoutes from './routes/moderationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';

import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';

connectDB();

const app = express();

// ============================================
// CORS CONFIGURATION (MUST BE FIRST!)
// ============================================

// Simple CORS config - allow all in development
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: true, // Allow all origins in development
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 600,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }));
} else {
    // Production CORS - strict
    const corsOptions = {
        origin: function (origin, callback) {
            const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [];
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            callback(null, false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 600,
    };
    app.use(cors(corsOptions));
}

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Set security HTTP headers
app.use(
    helmet({
        crossOriginResourcePolicy: false, // Allow CORS to work properly
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    })
);

// Sanitize data against XSS attacks
// DISABLED - xss-clean is not compatible with Express 5
// Using manual sanitization in validationMiddleware.js instead
// app.use(xss());

// Sanitize data against NoSQL injection  
// DISABLED - express-mongo-sanitize is not compatible with Express 5
// Using validation and sanitization in validationMiddleware.js instead
// app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 10000, // Very high limit in dev
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => {
        // Skip rate limiting for health check and docs
        return req.path === '/health' || req.path.startsWith('/api/docs');
    },
});

// Apply rate limiting to API routes only
app.use('/api', limiter);

// ============================================
// LOGGING MIDDLEWARE
// ============================================

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Colorful dev logging
} else {
    app.use(morgan('combined')); // Apache-style logging for production
}

// ============================================
// BODY PARSER & COMPRESSION
// ============================================

app.use(express.json({ limit: '10mb' })); // Parse JSON with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(compression()); // Compress all responses

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});

// ============================================
// BASIC ROUTES
// ============================================

app.get('/', (req, res) => {
    res.json({
        message: 'Netflixfake API',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/health',
    });
});

// ============================================
// API DOCUMENTATION
// ============================================

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// ============================================
// API ROUTES (v1)
// ============================================

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/history', historyRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1', reviewRoutes); // Review routes support both /movies/:id/reviews and /reviews/:id
app.use('/api/v1/moderation', moderationRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Legacy routes (backwards compatibility) - will be deprecated
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', reviewRoutes);

// ============================================
// STATIC FILE SERVING
// ============================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
    });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

app.use(errorHandler);

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log('================================================');
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
    console.log('================================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('🔥 UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('💀 Process terminated!');
    });
});

export default app;
