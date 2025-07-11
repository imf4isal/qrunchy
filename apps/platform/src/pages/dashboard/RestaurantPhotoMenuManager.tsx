import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Upload, Trash2, GripVertical, Eye, QrCode } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function RestaurantPhotoMenuManager() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { restaurants } = useAuth();
  const restaurantId = parseInt(params.id as string);
  
  const [images, setImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Get restaurant info
  const restaurant = restaurants.find(r => r.id === restaurantId);

  // Fetch existing photo menu data
  const { data: photoMenuData, refetch: refetchPhotoMenu } = trpc.photoMenu.getByRestaurant.useQuery(
    { restaurant_id: restaurantId },
    { enabled: !!restaurantId }
  );

  // Mutations
  const createMultipleMutation = trpc.photoMenu.createMultiple.useMutation();
  const updateSortOrderMutation = trpc.photoMenu.updateSortOrder.useMutation();
  const deleteMutation = trpc.photoMenu.delete.useMutation();
  const deleteAllMutation = trpc.photoMenu.deleteAll.useMutation();
  const generateQrMutation = trpc.photoMenu.generateQr.useMutation();

  // Load existing photos
  useEffect(() => {
    if (photoMenuData?.photos) {
      setImages(photoMenuData.photos.map(photo => ({
        id: photo.id.toString(),
        url: photo.image_url,
        sortOrder: photo.sort_order,
        dbId: photo.id,
      })));
    }
  }, [photoMenuData]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // Upload images to server
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      const uploadResponse = await fetch('http://localhost:3000/api/upload/photomenu', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload images');
      }

      const uploadResult = await uploadResponse.json();
      
      if (uploadResult.success && uploadResult.files) {
        // Create photo menu entries in database
        const imageUrls = uploadResult.files.map((file: any) => file.url);
        await createMultipleMutation.mutateAsync({
          restaurant_id: restaurantId,
          image_urls: imageUrls,
        });

        // Refresh the data
        refetchPhotoMenu();
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        const updatedImages = newItems.map((image, index) => ({
          ...image,
          sortOrder: index,
        }));

        setHasUnsavedChanges(true);
        return updatedImages;
      });
    }
  };

  const handleSaveSortOrder = async () => {
    try {
      const updates = images.map((image, index) => ({
        id: image.dbId,
        sort_order: index,
      }));

      await updateSortOrderMutation.mutateAsync({ updates });
      setHasUnsavedChanges(false);
      alert('Sort order saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save sort order');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteMutation.mutateAsync({ id: imageId });
      refetchPhotoMenu();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  const handleGenerateQr = async () => {
    try {
      const result = await generateQrMutation.mutateAsync({
        restaurant_id: restaurantId,
        setup_type: "self",
      });
      
      alert(`QR Code generated successfully! Code: ${result.qr_code}`);
    } catch (error) {
      console.error('QR generation error:', error);
      alert('Failed to generate QR code');
    }
  };

  const handleDeleteEntireMenu = async () => {
    if (!confirm(
      `Are you sure you want to delete the entire photo menu for "${restaurant?.name}"? This action cannot be undone and will remove all photos.`
    )) return;

    try {
      await deleteAllMutation.mutateAsync({ restaurant_id: restaurantId });
      alert('Entire photo menu deleted successfully!');
      refetchPhotoMenu();
    } catch (error) {
      console.error('Delete entire menu error:', error);
      alert('Failed to delete entire menu');
    }
  };

  // Sortable item component
  const SortableItem = ({ image, index }: { image: any; index: number }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: image.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
          isDragging ? "border-blue-500 shadow-lg" : "border-gray-200"
        }`}
      >
        <img
          src={image.url}
          alt={`Menu ${index + 1}`}
          className="w-full h-48 object-cover"
        />
        
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 bg-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
        >
          <GripVertical className="w-4 h-4 text-gray-600" />
        </div>

        {/* Delete button */}
        <button
          onClick={() => handleDeleteImage(image.dbId)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Position indicator */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {index + 1}
        </div>
      </div>
    );
  };

  if (!restaurant) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p>Restaurant not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setLocation("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Photo Menu Management
              </h1>
              <p className="text-gray-600">{restaurant.name}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {hasUnsavedChanges && (
              <Button onClick={handleSaveSortOrder}>
                Save Order
              </Button>
            )}
            <Button onClick={handleGenerateQr} variant="outline">
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR
            </Button>
            {images.length > 0 && (
              <Button onClick={handleDeleteEntireMenu} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Entire Menu
              </Button>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload New Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isUploading ? "Uploading..." : "Click to upload photos"}
                </p>
                <p className="text-gray-500">
                  Upload multiple images of your menu pages
                </p>
              </label>
            </div>
          </CardContent>
        </Card>


        {/* Photo Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Menu Photos ({images.length})
              </span>
              {images.length > 0 && (
                <p className="text-sm text-gray-600">
                  Drag to reorder • {hasUnsavedChanges ? "Unsaved changes" : "Saved"}
                </p>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {images.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  No photos uploaded yet
                </p>
                <p className="text-gray-500">
                  Upload some menu photos to get started
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map(img => img.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <SortableItem
                        key={image.id}
                        image={image}
                        index={index}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}