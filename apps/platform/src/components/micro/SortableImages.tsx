import { useState, useRef } from "react";
import { Move } from "lucide-react";

interface ImageItem {
  id: number;
  url: string;
  alt: string;
}

const ImprovedSortableImages = () => {
  const [images, setImages] = useState<ImageItem[]>([
    { id: 1, url: "/api/placeholder/600/400", alt: "Image 1" },
    { id: 2, url: "/api/placeholder/600/400", alt: "Image 2" },
    { id: 3, url: "/api/placeholder/600/400", alt: "Image 3" },
    { id: 4, url: "/api/placeholder/600/400", alt: "Image 4" },
  ]);

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

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">
        Sortable Image Gallery
      </h2>

      <div className="space-y-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`flex items-center p-2 rounded-lg border transition-all duration-200 ${
              draggedIndex === index
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-200 bg-gray-50"
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
            <div className="mr-3 text-gray-500">
              <Move size={20} />
            </div>
            <div className="w-full">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-48 object-cover rounded"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Drag the images using the handle on the left to reorder them
      </div>
    </div>
  );
};

export default ImprovedSortableImages;
