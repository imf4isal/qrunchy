import { trpc } from "@/utils/trpc";
import CustomerMenuViewer from "./CustomerMenuViewer";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import ExpiredScreen from "./components/ExpiredScreen";
import ActivationScreen from "./components/ActivationScreen";
import PhotoMenuPlaceholder from "./components/PhotoMenuPlaceholder";

interface MenuHandlerProps {
  qrCode: string;
}


export default function MenuHandler({ qrCode }: MenuHandlerProps) {
  // Use tRPC to fetch QR data from the real backend
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
    const restaurantWithDescription = qrData.restaurant ? {
      ...qrData.restaurant,
      description: qrData.restaurant.name + " - Digital Menu", // Add description
    } : null;
    return <ExpiredScreen restaurant={restaurantWithDescription} />;
  }

  if (qrData.needsActivation) {
    return <ActivationScreen expiresAt={qrData.expiresAt} />;
  }

  if (qrData.type === "digital") {
    return <CustomerMenuViewer qrCode={qrCode} />;
  }

  if (qrData.type === "photo") {
    return <PhotoMenuPlaceholder qrCode={qrCode} />;
  } 

  return null;
}
