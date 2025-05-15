// src/pages/photomenu/PhotoMenu.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import ImageUploader from "./ImageUploader";
import SortableImages from "./SortableImages";

export default function PhotoMenu() {
  const [images, setImages] = useState<string[]>([]);
  const [step, setStep] = useState<"upload" | "arrange" | "qr">("upload");

  const handleImagesUploaded = (newImages: string[]) => {
    setImages((prev) => [...prev, ...newImages]);
    if (images.length > 0 || newImages.length > 0) {
      setStep("arrange");
    }
  };

  const handleImageOrderChange = (newOrder: string[]) => {
    setImages(newOrder);
  };

  const handleProceedToQR = () => {
    setStep("qr");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Create Photo Menu
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-12">
          <div
            className={`flex items-center ${
              step === "upload" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-current">
              1
            </div>
            <span className="ml-2">Upload</span>
          </div>
          <div className="w-12 h-0.5 mx-2 bg-gray-300"></div>
          <div
            className={`flex items-center ${
              step === "arrange" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-current">
              2
            </div>
            <span className="ml-2">Arrange</span>
          </div>
          <div className="w-12 h-0.5 mx-2 bg-gray-300"></div>
          <div
            className={`flex items-center ${
              step === "qr" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-current">
              3
            </div>
            <span className="ml-2">Generate QR</span>
          </div>
        </div>

        {/* Content based on current step */}
        <div className="max-w-3xl mx-auto">
          {step === "upload" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Menu Images</h2>
              <p className="text-gray-600 mb-6">
                Upload photos of your menu. You can upload multiple images if
                your menu has multiple pages.
              </p>
              <ImageUploader onImagesUploaded={handleImagesUploaded} />
            </Card>
          )}

          {step === "arrange" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Arrange Images</h2>
              <p className="text-gray-600 mb-6">
                Drag and drop to arrange your menu images in the correct order.
              </p>
              <SortableImages
                images={images}
                onOrderChange={handleImageOrderChange}
              />
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  Back to Upload
                </Button>
                <Button onClick={handleProceedToQR}>Continue</Button>
              </div>
            </Card>
          )}

          {step === "qr" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Generate QR Code</h2>
              <p className="text-gray-600 mb-6">
                You're ready to create your QR code! Choose how you want to
                proceed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 border-2 border-blue-100 hover:border-blue-500 cursor-pointer">
                  <h3 className="font-semibold mb-2">Self-Serve QR</h3>
                  <p className="text-sm text-gray-600">
                    Generate a QR code instantly. You'll need to create an
                    account to keep it active.
                  </p>
                </Card>

                <Card className="p-4 border-2 border-blue-100 hover:border-blue-500 cursor-pointer">
                  <h3 className="font-semibold mb-2">Request QR</h3>
                  <p className="text-sm text-gray-600">
                    We'll set up your QR code and send you your login details.
                  </p>
                </Card>
              </div>

              <div className="mt-8">
                <Button
                  variant="outline"
                  onClick={() => setStep("arrange")}
                  className="mr-4"
                >
                  Back
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
