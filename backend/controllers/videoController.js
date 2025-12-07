import asyncHandler from 'express-async-handler';
import { uploadVideo, deleteFile } from '../config/cloudinary.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for temporary file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/temp';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedVideoTypes = /mp4|avi|mkv|mov|wmv/;
    const extname = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('video/');

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'), false);
    }
};

export const uploadVideoFile = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB max file size
    },
});

// @desc    Upload video to Cloudinary
// @route   POST /api/videos/upload
// @access  Private/Admin
export const uploadVideoToCloud = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No video file uploaded');
    }

    try {
        const filePath = req.file.path;

        // Upload to Cloudinary
        const result = await uploadVideo(filePath);

        // Delete temporary file
        fs.unlinkSync(filePath);

        res.json({
            url: result.url,
            publicId: result.publicId,
            duration: result.duration,
            format: result.format,
        });
    } catch (error) {
        // Clean up temp file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500);
        throw new Error(error.message);
    }
});

// @desc    Delete video from Cloudinary
// @route   DELETE /api/videos/:publicId
// @access  Private/Admin
export const deleteVideoFromCloud = asyncHandler(async (req, res) => {
    const { publicId } = req.params;

    if (!publicId) {
        res.status(400);
        throw new Error('Public ID is required');
    }

    try {
        await deleteFile(publicId, 'video');
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// @desc    Get video upload progress (for future implementation with socket.io)
// @route   GET /api/videos/progress/:uploadId
// @access  Private/Admin
export const getUploadProgress = asyncHandler(async (req, res) => {
    // This would be implemented with socket.io for real-time progress
    res.json({ message: 'Upload progress endpoint - to be implemented with WebSocket' });
});
