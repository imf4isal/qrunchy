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
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800">
              Create Photo Menu
            </h1>
            <p className="mt-2 text-gray-600">
              Upload and arrange your menu photos to create a QR code menu for
              your restaurant
            </p>
          </div>

          {/* Progress Steps
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
          </div> */}

          {/* Refined Progress Steps UI */}
          <div className="mb-16">
            <div className="relative">
              {/* Background Track */}
              <div className="absolute left-5 right-5 top-7 h-1 bg-gray-100 rounded-full"></div>

              {/* Animated Fill Track */}
              <div
                className="absolute left-5 top-7 h-1 bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width:
                    step === "upload" ? "0%" : step === "sort" ? "50%" : "100%",
                }}
              ></div>

              <div className="relative flex justify-between">
                {/* Step 1 - Upload */}
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300
            ${
              step === "upload"
                ? "border-blue-500 bg-white text-blue-500"
                : step === "sort" || step === "generate"
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-200 bg-white text-gray-400"
            }`}
                  >
                    {step === "sort" || step === "generate" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`font-medium text-sm mt-3 transition-colors duration-300
          ${step === "upload" || step === "sort" || step === "generate" ? "text-blue-600" : "text-gray-500"}`}
                  >
                    Upload
                  </span>
                </div>

                {/* Step 2 - Arrange */}
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300
            ${
              step === "sort"
                ? "border-blue-500 bg-white text-blue-500"
                : step === "generate"
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-200 bg-white text-gray-400"
            }`}
                  >
                    {step === "generate" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`font-medium text-sm mt-3 transition-colors duration-300
          ${step === "sort" || step === "generate" ? "text-blue-600" : "text-gray-500"}`}
                  >
                    Arrange
                  </span>
                </div>

                {/* Step 3 - Generate QR */}
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300
      ${
        step === "generate"
          ? "border-blue-500 bg-blue-500 text-white"
          : "border-gray-200 bg-white text-gray-400"
      }`}
                  >
                    {step === "generate" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`font-medium text-sm mt-3 transition-colors duration-300
    ${step === "generate" ? "text-blue-600" : "text-gray-500"}`}
                  >
                    QR Code
                  </span>
                </div>
              </div>
            </div>

            {/* Step Description */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {step === "upload"
                  ? "Upload photos of your menu - you can add multiple pages"
                  : step === "sort"
                    ? "Drag and drop to arrange your menu in the correct order"
                    : "Generate your QR code and make it available to customers"}
              </p>
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
