import path from 'path';
import multer from 'multer';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = 'uploads/';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadsDir);
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// File type validation for images
function checkImageType(file, cb) {
    const filetypes = /jpg|jpeg|png|gif|webp/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed!'));
    }
}

// File type validation for videos
function checkVideoType(file, cb) {
    const filetypes = /mp4|mov|avi|mkv|webm/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = file.mimetype.startsWith('video/');

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only video files (mp4, mov, avi, mkv, webm) are allowed!'));
    }
}

// Image upload middleware
export const uploadImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit for images
    },
    fileFilter: function (req, file, cb) {
        checkImageType(file, cb);
    },
});

// Video upload middleware
export const uploadVideo = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit for videos
    },
    fileFilter: function (req, file, cb) {
        checkVideoType(file, cb);
    },
});
