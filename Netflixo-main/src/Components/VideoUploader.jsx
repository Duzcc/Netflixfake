import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiVideo, FiX } from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';

function VideoUploader({ onVideoSelect, currentVideo }) {
    const [preview, setPreview] = useState(currentVideo || null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];

        // Validate file size (max 500MB)
        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('Video file size must be less than 500MB');
            return;
        }

        setError('');
        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('video', file);

            // Upload to backend
            const { data } = await api.post('/videos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            setPreview(data.url);
            if (onVideoSelect) {
                onVideoSelect(data);
            }
            toast.success('Video uploaded successfully!');
        } catch (err) {
            setError('Failed to upload video. Please try again.');
            toast.error('Video upload failed');
            console.error('Error uploading video:', err);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }, [onVideoSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'video/mp4': ['.mp4'],
            'video/avi': ['.avi'],
            'video/mkv': ['.mkv'],
            'video/mov': ['.mov'],
        },
        disabled: uploading,
    });

    const handleRemove = () => {
        setPreview(null);
        setError('');
        if (onVideoSelect) {
            onVideoSelect(null);
        }
    };

    return (
        <div className="w-full">
            {preview ? (
                <div className="relative">
                    <div className="bg-dry border border-border rounded-lg p-4">
                        <div className="flex items-center gap-4">
                            <FiVideo className="text-4xl text-subMain" />
                            <div className="flex-1">
                                <p className="text-sm font-medium truncate">{preview}</p>
                                <p className="text-xs text-text mt-1">Video uploaded successfully</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="text-red-500 hover:text-red-400 transitions"
                                disabled={uploading}
                            >
                                <FiX className="text-2xl" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`px-6 py-12 border-2 border-dashed rounded-lg cursor-pointer transitions ${isDragActive
                            ? 'border-subMain bg-dry'
                            : 'border-border bg-main hover:border-subMain'
                        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <input {...getInputProps()} />
                    <div className="text-center">
                        <FiUploadCloud className="mx-auto text-5xl text-subMain mb-4" />
                        {uploading ? (
                            <>
                                <p className="text-sm mb-2">Uploading video...</p>
                                <div className="w-full bg-border rounded-full h-2 mb-2">
                                    <div
                                        className="bg-subMain h-2 rounded-full transitions"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-text">{uploadProgress}%</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm mb-2">
                                    {isDragActive
                                        ? 'Drop the video here'
                                        : 'Drag and drop video here, or click to select'}
                                </p>
                                <em className="text-xs text-border">
                                    (MP4, AVI, MKV, MOV - max 500MB)
                                </em>
                            </>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="text-red-500 text-xs mt-2">{error}</p>
            )}
        </div>
    );
}

export default VideoUploader;
