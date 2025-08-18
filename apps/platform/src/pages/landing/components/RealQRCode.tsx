import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode } from "lucide-react";

export const RealQRCode: React.FC<{
  text: string;
  size?: number;
  className?: string;
}> = ({ text, size = 210, className }) => {
  const [qrDataURL, setQrDataURL] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Add https:// if not present for a valid URL
        const url = text.startsWith("http") ? text : `https://${text}`;
        const dataURL = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        setQrDataURL(dataURL);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQR();
  }, [text, size]);

  if (!qrDataURL) {
    return (
      <div
        className={`bg-neutral-200 animate-pulse rounded-lg border border-neutral-700/50 flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-neutral-600 text-xs">
          <QrCode className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <img
      src={qrDataURL}
      alt={`QR code for ${text}`}
      width={size}
      height={size}
      className={`${className} animate-in fade-in duration-300`}
    />
  );
};