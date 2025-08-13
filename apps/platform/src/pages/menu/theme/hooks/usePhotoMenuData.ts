import { useState, useEffect } from "react";
import { getPhotoMenu } from "@/utils/photoMenuStorage";
import { trpc } from "@/utils/trpc";
import type { PhotoMenuData } from "@/types/photoMenu";

interface UsePhotoMenuDataProps {
  qrCode: string;
  useServerData?: boolean;
}

export function usePhotoMenuData({ qrCode, useServerData = false }: UsePhotoMenuDataProps) {
  const [photoMenu, setPhotoMenu] = useState<PhotoMenuData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server data fetching (only when useServerData is true)
  const {
    data: serverPhotoMenuData,
    isLoading: serverLoading,
    error: serverError,
  } = trpc.photoMenu.getByQrCode.useQuery(
    { qr_code: qrCode },
    { enabled: useServerData }
  );

  // Load photo menu data
  useEffect(() => {
    if (useServerData) {
      // Server data handling
      setIsLoading(serverLoading);
      
      if (serverError) {
        setError("Failed to load photo menu from server");
        setPhotoMenu(null);
        return;
      }

      if (serverPhotoMenuData?.photos && serverPhotoMenuData.photos.length > 0) {
        // Convert server data to PhotoMenuData format
        const convertedData: PhotoMenuData = {
          qrCode: qrCode,
          restaurant: {
            name: serverPhotoMenuData.photos[0].restaurant_name,
            address: serverPhotoMenuData.photos[0].restaurant_address || "",
            phone: serverPhotoMenuData.photos[0].restaurant_mobile,
          },
          images: serverPhotoMenuData.photos.map((photo, index) => ({
            id: photo.id.toString(),
            url: photo.image_url,
            order: photo.sort_order || index,
          })),
          createdAt: serverPhotoMenuData.photos[0].created_at,
          updatedAt: serverPhotoMenuData.photos[0].updated_at,
        };
        setPhotoMenu(convertedData);
        setError(null);
      } else if (!serverLoading) {
        setError("Photo menu not found");
        setPhotoMenu(null);
      }
    } else {
      // localStorage data handling
      setIsLoading(true);
      setError(null);
      
      try {
        const menuData = getPhotoMenu(qrCode);
        if (menuData) {
          setPhotoMenu(menuData);
        } else {
          setError("Photo menu not found");
        }
      } catch (err) {
        setError("Failed to load photo menu");
        console.error("Error loading photo menu:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [qrCode, useServerData, serverPhotoMenuData, serverLoading, serverError]);

  return { photoMenu, isLoading, error };
}