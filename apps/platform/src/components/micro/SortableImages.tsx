import { useState } from "react";
import { Move } from "lucide-react";

const SortableImages = () => {
  const [images, setImages] = useState([
    { id: 1, url: "/api/placeholder/600/400", alt: "Image 1" },
    { id: 2, url: "/api/placeholder/600/400", alt: "Image 2" },
    { id: 3, url: "/api/placeholder/600/400", alt: "Image 3" },
    { id: 4, url: "/api/placeholder/600/400", alt: "Image 4" },
  ]);

  const [draggedItem, setDraggedItem] = useState<null | number>();

  const handleDragStart = (e: any, index: any) => {
    setDraggedItem(index);
    // This makes the dragged item transparent for better UX
    e.currentTarget.style.opacity = "0.4";
  };

  const handleDragOver = (e: any, index: any) => {
    e.preventDefault();
    const draggedOverItem = images[index];

    // If item is dragged over itself, ignore
    if (draggedItem === index) return;

    // Filter out the currently dragged item
    let newItems = images.filter((_, idx) => idx !== draggedItem);

    // Add the dragged item after the dragged over item
    draggedItem && newItems.splice(index, 0, images[draggedItem]);

    setDraggedItem(index);
    setImages(newItems);
  };

  const handleDragEnd = (e: any) => {
    // Reset the opacity
    e.currentTarget.style.opacity = "1";
    setDraggedItem(null);
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
            className="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-move"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="mr-3 text-gray-500">
              <Move size={20} />
            </div>
            <div className="w-full">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-48 object-cover rounded"
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

export default SortableImages;
