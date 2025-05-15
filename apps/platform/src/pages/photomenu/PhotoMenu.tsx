// src/pages/photomenu/PhotoMenu.tsx
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUploader from "./ImageUploader";
import SortableImages from "./SortableImages";
import QRCodeGenerator from "./QRCodeGenerator";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

// We'll maintain the flow state in the parent component
export default function PhotoMenu() {
  const [step, setStep] = useState<"upload" | "sort" | "generate">("upload");
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleImagesUploaded = (newImages: UploadedImage[]) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleNext = () => {
    if (step === "upload") {
      setStep("sort");
    } else if (step === "sort") {
      setStep("generate");
    }
  };

  const handleBack = () => {
    if (step === "sort") {
      setStep("upload");
    } else if (step === "generate") {
      setStep("sort");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800">
              Create Photo Menu
            </h1>
            <p className="mt-2 text-gray-600">
              Upload and arrange your menu photos to create a QR code menu for
              your restaurant
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-12 relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>

            <div
              className={`flex flex-col items-center ${step === "upload" ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step === "upload" ? "bg-blue-600 text-white" : "bg-white border-2 border-current"}`}
              >
                1
              </div>
              <span className="mt-2 text-sm font-medium">Upload</span>
            </div>

            <div
              className={`flex flex-col items-center ${step === "sort" ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step === "sort" ? "bg-blue-600 text-white" : "bg-white border-2 border-current"}`}
              >
                2
              </div>
              <span className="mt-2 text-sm font-medium">Arrange</span>
            </div>

            <div
              className={`flex flex-col items-center ${step === "generate" ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step === "generate" ? "bg-blue-600 text-white" : "bg-white border-2 border-current"}`}
              >
                3
              </div>
              <span className="mt-2 text-sm font-medium">Generate QR</span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            {step === "upload" && (
              <div>
                <ImageUploader
                  onImagesAdded={handleImagesUploaded}
                  existingImages={images}
                />
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={images.length === 0}
                    className="flex items-center gap-2"
                  >
                    Continue <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            )}

            {step === "sort" && (
              <div>
                <SortableImages images={images} setImages={setImages} />
                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    Continue <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            )}

            {step === "generate" && (
              <div>
                <QRCodeGenerator images={images} />
                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Back
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
