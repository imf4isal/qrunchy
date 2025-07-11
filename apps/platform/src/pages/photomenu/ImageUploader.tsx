import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { Upload, X, Loader2 } from "lucide-react";

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  url?: string; // Server URL after upload
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
}

interface ImageUploaderProps {
  onImagesAdded: (images: UploadedImage[]) => void;
  onImageRemoved: (id: string) => void;
  onImagesUploaded?: (uploadedUrls: string[]) => void; // Callback for server uploads
  existingImages?: UploadedImage[];
  useServerUpload?: boolean; // Whether to upload to server immediately
  restaurantId?: number; // Required for server uploads
}

const ImageUploader = ({
  onImagesAdded,
  onImageRemoved,
  onImagesUploaded,
  existingImages = [],
  useServerUpload = false,
  restaurantId,
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);

    e.target.value = "";
  };

  const processFiles = async (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newImages = imageFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      preview: URL.createObjectURL(file),
      uploading: useServerUpload,
      uploaded: false,
    }));

    onImagesAdded(newImages);

    // If server upload is enabled, upload files immediately
    if (useServerUpload && restaurantId) {
      setIsUploading(true);
      await uploadToServer(newImages);
      setIsUploading(false);
    }
  };

  const uploadToServer = async (images: UploadedImage[]) => {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image.file);
      });

      const response = await fetch('http://localhost:3000/api/upload/photomenu', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success && result.files) {
        const uploadedUrls = result.files.map((file: any) => file.url);
        onImagesUploaded?.(uploadedUrls);
        
        // Update images with server URLs
        images.forEach((image, index) => {
          image.url = result.files[index]?.url;
          image.uploading = false;
          image.uploaded = true;
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      // Mark images as failed
      images.forEach((image) => {
        image.uploading = false;
        image.uploaded = false;
        image.error = 'Upload failed';
      });
    }
  };

  const removeImage = (id: string) => {
    // Instead of trying to update the images array here,
    // just notify the parent component to remove this image
    onImageRemoved(id);
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Upload Menu Images</h2>
      <p className="text-gray-600 mb-6">
        Upload photos of your restaurant menu. You can add multiple images if
        your menu has several pages.
      </p>

      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isUploading
            ? "border-blue-500 bg-blue-50 pointer-events-none"
            : isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onClick={!isUploading ? handleAreaClick : undefined}
        onDragOver={!isUploading ? handleDragOver : undefined}
        onDragLeave={!isUploading ? handleDragLeave : undefined}
        onDrop={!isUploading ? handleDrop : undefined}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />

        {isUploading ? (
          <>
            <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
            <p className="mt-3 text-sm text-blue-600">
              Uploading images to server...
            </p>
          </>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-3 text-sm text-gray-600">
              Drag and drop images here, or click to select files
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supports: JPG, PNG, GIF, WebP
            </p>
          </>
        )}
      </div>

      {existingImages.length > 0 && (
        <div className="mt-8">
          <h3 className="font-medium mb-3">
            Uploaded Images ({existingImages.length})
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.map((image) => (
              <div
                key={image.id}
                className="relative group overflow-hidden rounded-lg"
              >
                <img
                  src={image.url || image.preview}
                  alt={image.file.name}
                  className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                />

                {/* Upload status overlay */}
                {image.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}

                {image.error && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                    <X className="h-6 w-6 text-white" />
                  </div>
                )}

                {image.uploaded && !image.uploading && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>

                <div className="px-1 mt-1">
                  <p className="text-xs truncate">{image.file.name}</p>
                  {image.error && (
                    <p className="text-xs text-red-500">{image.error}</p>
                  )}
                  {image.uploaded && (
                    <p className="text-xs text-green-600">Uploaded</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
