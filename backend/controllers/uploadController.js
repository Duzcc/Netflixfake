import asyncHandler from 'express-async-handler';
import path from 'path';
import fs from 'fs';
import { uploadImage, uploadVideo, deleteFile } from '../config/cloudinary.js';

/**
 * @desc    Upload image to Cloudinary
 * @route   POST /api/upload/image
 * @access  Private
 */
const uploadImageFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload an image file');
    }

    try {
        // Upload to Cloudinary
        const result = await uploadImage(req.file.path);

        // Delete local file after successful upload
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            url: result.url,
            publicId: result.publicId,
            message: 'Image uploaded successfully',
        });
    } catch (error) {
        // Clean up local file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500);
        throw new Error(error.message || 'Image upload failed');
    }
});

/**
 * @desc    Upload video to Cloudinary
 * @route   POST /api/upload/video
 * @access  Private/Admin
 */
const uploadVideoFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a video file');
    }

    try {
        // Upload to Cloudinary
        const result = await uploadVideo(req.file.path);

        // Delete local file after successful upload
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            url: result.url,
            publicId: result.publicId,
            duration: result.duration,
            format: result.format,
            message: 'Video uploaded successfully',
        });
    } catch (error) {
        // Clean up local file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500);
        throw new Error(error.message || 'Video upload failed');
    }
});

/**
 * @desc    Delete file from Cloudinary
 * @route   DELETE /api/upload/:publicId
 * @access  Private/Admin
 */
const deleteUploadedFile = asyncHandler(async (req, res) => {
    const { publicId } = req.params;
    const { resourceType = 'image' } = req.body;

    if (!publicId) {
        res.status(400);
        throw new Error('Public ID is required');
    }

    try {
        // Decode publicId (it might be URL encoded)
        const decodedPublicId = decodeURIComponent(publicId);

        const result = await deleteFile(decodedPublicId, resourceType);

        res.status(200).json({
            success: true,
            message: 'File deleted successfully',
            result,
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message || 'File deletion failed');
    }
});

export { uploadImageFile, uploadVideoFile, deleteUploadedFile };
