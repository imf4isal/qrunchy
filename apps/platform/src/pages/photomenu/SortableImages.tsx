import { useState, useRef } from "react";
import { Move } from "lucide-react";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface SortableImagesProps {
  images: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}

const SortableImages = ({ images, setImages }: SortableImagesProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number): void => {
    dragItem.current = index;
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number): void => {
    dragOverItem.current = index;

    const imagesCopy = [...images];

    if (dragItem.current !== null) {
      const draggedItemContent = imagesCopy[dragItem.current];

      imagesCopy.splice(dragItem.current, 1);
      imagesCopy.splice(dragOverItem.current, 0, draggedItemContent);

      dragItem.current = dragOverItem.current;

      setImages(imagesCopy);
    }
  };

  const handleDragEnd = (): void => {
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedIndex(null);
  };

  const handleDrop = (): void => {
    handleDragEnd();
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No images to arrange. Please upload some images first.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Arrange Menu Images</h2>
      <p className="text-gray-600 mb-6">
        Drag and drop to reorder your menu images. The order here is how they'll
        appear to customers.
      </p>

      <div className="space-y-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
              draggedIndex === index
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            } cursor-move`}
            draggable={true}
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
              e.preventDefault()
            }
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
          >
            <div className="mr-4 text-gray-400 hover:text-gray-600">
              <Move size={20} />
            </div>
            <div className="flex-1 flex items-center gap-3">
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={image.preview}
                  alt={image.file.name}
                  className="w-full h-full object-cover rounded"
                  draggable={false}
                />
              </div>
              <span className="text-sm truncate">{image.file.name}</span>
            </div>
            <div className="ml-2 text-sm font-medium text-gray-500">
              {index + 1} / {images.length}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Tip: Drag using the handle on the left to reorder your menu images
      </div>
    </div>
  );
};

export default SortableImages;
