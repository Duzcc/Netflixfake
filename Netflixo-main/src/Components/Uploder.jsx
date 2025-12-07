import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { validateImageFile } from "../utils/authUtils";
import api from "../utils/api";

function Uploder({ onImageSelect, currentImage }) {
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      setError("");

      try {
        setPreview(URL.createObjectURL(file)); // Show local preview immediately

        const formData = new FormData();
        formData.append("image", file);

        // Upload to backend
        // We need to import api here or pass it down. 
        // Assuming api is available or we use fetch/axios directly.
        // Let's import api from utils.
        const { data } = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Call parent callback with the returned URL
        if (onImageSelect) {
          onImageSelect(data); // data should be the file path string
        }
      } catch (err) {
        setError("Failed to upload image. Please try again.");
        console.error("Error uploading image:", err);
        setPreview(null); // Revert preview on error
      }
    },
  });

  const handleRemove = () => {
    setPreview(null);
    setError("");
    if (onImageSelect) {
      onImageSelect(null);
    }
  };

  return (
    <div className="w-full text-center">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Avatar preview"
            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-border"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="mt-3 text-sm text-red-500 hover:text-red-400 transitions"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="px-6 py-8 border-2 border-border border-dashed bg-main rounded-md cursor-pointer hover:border-subMain transitions"
        >
          <input {...getInputProps()} />
          <span className="mx-auto flex-colo text-subMain text-3xl">
            <FiUploadCloud />
          </span>
          <p className="text-sm mt-2">Drag your avatar here</p>
          <em className="text-xs text-border">
            (only .jpg, .png and .gif files, max 2MB)
          </em>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}

export default Uploder;

