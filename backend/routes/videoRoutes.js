import express from 'express';
import {
    uploadVideoToCloud,
    deleteVideoFromCloud,
    getUploadProgress,
    uploadVideoFile,
} from '../controllers/videoController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Upload video (admin only)
router.post('/upload', protect, admin, uploadVideoFile.single('video'), uploadVideoToCloud);

// Delete video (admin only)
router.delete('/:publicId', protect, admin, deleteVideoFromCloud);

// Get upload progress
router.get('/progress/:uploadId', protect, admin, getUploadProgress);

export default router;
