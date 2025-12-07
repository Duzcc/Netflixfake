import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to the file
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Object>} Upload result
 */
export const uploadImage = async (filePath, folder = 'netflixo/images') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: 'image',
            transformation: [
                { width: 1000, height: 1500, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        throw new Error(`Image upload failed: ${error.message}`);
    }
};

/**
 * Upload video to Cloudinary
 * @param {string} filePath - Path to the video file
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Object>} Upload result
 */
export const uploadVideo = async (filePath, folder = 'netflixo/videos') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: 'video',
            chunk_size: 6000000, // 6MB chunks for large files
            eager: [
                { width: 1920, height: 1080, crop: 'limit', quality: 'auto', format: 'mp4' },
                { width: 1280, height: 720, crop: 'limit', quality: 'auto', format: 'mp4' },
            ],
            eager_async: true,
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
            duration: result.duration,
            format: result.format,
        };
    } catch (error) {
        throw new Error(`Video upload failed: ${error.message}`);
    }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file
 * @param {string} resourceType - Type of resource ('image' or 'video')
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFile = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
        return result;
    } catch (error) {
        throw new Error(`File deletion failed: ${error.message}`);
    }
};

export default cloudinary;
