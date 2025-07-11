import { trpc } from "@/utils/trpc";
import CustomerMenuViewer from "./theme/CustomerMenuViewer";
import CustomerMenuViewerModern from "./theme/CustomerMenuViewerModern";
import PhotoMenuViewer from "./theme/PhotoMenuViewer";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import ExpiredScreen from "./components/ExpiredScreen";
import ActivationScreen from "./components/ActivationScreen";
import PhotoMenuPlaceholder from "./components/PhotoMenuPlaceholder";
import { getPhotoMenu } from "@/utils/photoMenuStorage";

interface MenuHandlerProps {
  qrCode: string;
}

export default function MenuHandler({ qrCode }: MenuHandlerProps) {
  // Check if this is a photo menu QR code (starts with "photo_")
  const isPhotoMenuQR = qrCode.startsWith("photo_");
  
  // For photo menus, try server first, fallback to localStorage
  const {
    data: photoMenuData,
    isLoading: photoMenuLoading,
  } = trpc.photoMenu.getByQrCode.useQuery(
    { qr_code: qrCode },
    { enabled: isPhotoMenuQR }
  );
  
  if (isPhotoMenuQR) {
    if (photoMenuLoading) {
      return <LoadingScreen />;
    }

    if (photoMenuData?.photos && photoMenuData.photos.length > 0) {
      // Use server data
      return <PhotoMenuViewer qrCode={qrCode} useServerData={true} />;
    }

    // Fallback to localStorage for development/legacy data
    const photoMenu = getPhotoMenu(qrCode);
    if (photoMenu) {
      return <PhotoMenuViewer qrCode={qrCode} useServerData={false} />;
    }

    // Photo menu not found anywhere
    return <ErrorScreen onRetry={() => window.location.reload()} />;
  }

  // Use tRPC to fetch QR data from the real backend for digital menus
  const {
    data: qrData,
    isLoading: loading,
    error,
  } = trpc.digitalMenu.qr.getQrData.useQuery({ qr_code: qrCode });

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !qrData) {
    return <ErrorScreen onRetry={() => window.location.reload()} />;
  }

  if (qrData.status === "expired" || !qrData.isActive) {
    const restaurantWithDescription = qrData.restaurant
      ? {
          ...qrData.restaurant,
          description: qrData.restaurant.name + " - Digital Menu", // Add description
        }
      : null;
    return <ExpiredScreen restaurant={restaurantWithDescription} />;
  }

  if (qrData.needsActivation) {
    return <ActivationScreen expiresAt={qrData.expiresAt} />;
  }

  if (qrData.type === "digital") {
    // Route to appropriate theme component based on restaurant's theme
    const themeId = qrData.restaurant?.theme_id || "modern";

    switch (themeId) {
      case "modern":
        return <CustomerMenuViewerModern qrCode={qrCode} />;
      case "minimal":
      default:
        return <CustomerMenuViewer qrCode={qrCode} />;
    }
  }

  if (qrData.type === "photo") {
    return <PhotoMenuPlaceholder qrCode={qrCode} />;
  }

  return null;
}
