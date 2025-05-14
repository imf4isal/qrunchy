import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { Upload, X } from "lucide-react";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

const ImageUploader = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
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

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
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
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Images</h2>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop images here, or click to select files
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supports: JPG, PNG, GIF, WebP
        </p>
      </div>

      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">
            Uploaded Images ({images.length})
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.preview}
                  alt={image.file.name}
                  className="h-32 w-full object-cover rounded border border-gray-200"
                />

                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>

                <p className="text-xs mt-1 truncate">{image.file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
