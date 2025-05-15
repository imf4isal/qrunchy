import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { Upload, X } from "lucide-react";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  onImagesAdded: (images: UploadedImage[]) => void;
  onImageRemoved: (id: string) => void; // New prop for removing images
  existingImages?: UploadedImage[];
}

const ImageUploader = ({
  onImagesAdded,
  onImageRemoved, // Add this prop
  existingImages = [],
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);

    e.target.value = "";
  };

  const processFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newImages = imageFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      preview: URL.createObjectURL(file),
    }));

    onImagesAdded(newImages);
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
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onClick={handleAreaClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-3 text-sm text-gray-600">
          Drag and drop images here, or click to select files
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supports: JPG, PNG, GIF, WebP
        </p>
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
                  src={image.preview}
                  alt={image.file.name}
                  className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                />

                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>

                <p className="text-xs mt-1 truncate px-1">{image.file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
