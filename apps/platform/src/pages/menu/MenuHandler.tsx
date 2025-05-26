import { useState, useEffect } from "react";
import { dummyQrData } from "@/data/dummyData";
import CustomerMenuViewer from "./CustomerMenuViewer";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import ExpiredScreen from "./components/ExpiredScreen";
import ActivationScreen from "./components/ActivationScreen";
import PhotoMenuPlaceholder from "./components/PhotoMenuPlaceholder";

interface MenuHandlerProps {
  qrCode: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
}

interface QrCodeData {
  id: string;
  type: "digital" | "photo";
  status: "available" | "used" | "expired";
  restaurant: Restaurant | null;
  expiresAt: string | null;
  isActive: boolean;
  needsActivation?: boolean;
}

export default function MenuHandler({ qrCode }: MenuHandlerProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [qrData, setQrData] = useState<QrCodeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQrData = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const data = dummyQrData[qrCode as keyof typeof dummyQrData];

        if (!data) {
          throw new Error("QR code not found");
        }

        setQrData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchQrData();
  }, [qrCode]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !qrData) {
    return <ErrorScreen onRetry={() => window.location.reload()} />;
  }

  if (qrData.status === "expired" || !qrData.isActive) {
    return <ExpiredScreen restaurant={qrData.restaurant} />;
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
