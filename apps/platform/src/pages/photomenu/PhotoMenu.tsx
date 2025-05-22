// src/pages/photomenu/PhotoMenu.tsx
import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUploader from "./ImageUploader";
import SortableImages from "./SortableImages";
import QRCodeGenerator from "./QRCodeGenerator";
import PhotoMenuPreview from "./PhotoMenuPreview";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export default function PhotoMenu() {
  const [step, setStep] = useState<"setup" | "upload" | "sort" | "generate">(
    "setup"
  );
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");

  const handleImagesUploaded = (newImages: UploadedImage[]) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleQrGenerated = () => {
    setQrGenerated(true);
  };

  const handleNext = () => {
    if (step === "setup") {
      setStep("upload");
    } else if (step === "upload") {
      setStep("sort");
    } else if (step === "sort") {
      setStep("generate");
    }
  };

  const handleBack = () => {
    if (step === "upload") {
      setStep("setup");
    } else if (step === "sort") {
      setStep("upload");
    } else if (step === "generate") {
      setStep("sort");
      // Reset QR generation state when going back from generate step
      setQrGenerated(false);
    }
  };

  const handleImageRemoved = (id: string) => {
    setImages((prev) => {
      // Find the image to be removed
      const imageToRemove = prev.find((img) => img.id === id);

      // Revoke the object URL to prevent memory leaks
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      // Return the filtered array
      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold rounded-xl mb-4">
                Q
              </div>
              <div className="text-sm text-gray-500 font-medium">QRUNCHY</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Create Photo Menu
            </h1>
            <p className="mt-2 text-gray-600">
              Upload and arrange your menu photos to create a QR code menu for
              your restaurant
            </p>
          </div>

          <div className="mb-16">
            <div className="relative">
              <div className="absolute left-5 right-5 top-7 h-1 bg-gray-100 rounded-full"></div>

              <div
                className="absolute left-5 top-7 h-1 bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width:
                    step === "setup"
                      ? "0%"
                      : step === "upload"
                        ? "25%"
                        : step === "sort"
                          ? "50%"
                          : qrGenerated
                            ? "calc(100% - 25px)"
                            : "75%",
                  maxWidth: "calc(100% - 25px)",
                }}
              ></div>

              <div className="relative flex justify-between">
                {/* Setup */}
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300
                      ${
                        step === "setup"
                          ? "border-blue-500 bg-white text-blue-500"
                          : step === "upload" ||
                              step === "sort" ||
                              step === "generate"
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-200 bg-white text-gray-400"
                      }`}
                  >
                    {step === "upload" ||
                    step === "sort" ||
                    step === "generate" ? (
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`font-medium text-sm mt-3 transition-colors duration-300
                      ${step === "setup" || step === "upload" || step === "sort" || step === "generate" ? "text-blue-600" : "text-gray-500"}`}
                  >
                    Setup
                  </span>
                </div>

                {/* upload */}
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

                {/* arrange */}
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

                {/* generate QR */}
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300
                      ${
                        qrGenerated
                          ? "border-blue-500 bg-blue-500 text-white"
                          : step === "generate"
                            ? "border-blue-500 bg-white text-blue-500"
                            : "border-gray-200 bg-white text-gray-400"
                      }`}
                  >
                    {qrGenerated ? (
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
                {step === "setup"
                  ? "Enter basic information about your restaurant"
                  : step === "upload"
                    ? "Upload photos of your menu - you can add multiple pages"
                    : step === "sort"
                      ? "Drag and drop to arrange your menu in the correct order"
                      : qrGenerated
                        ? "Your QR code is ready to share with customers"
                        : "Generate your QR code and make it available to customers"}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border p-8">
                {step === "setup" && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">
                      Restaurant Information
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Start by entering your restaurant's basic information
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="restaurantName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Restaurant Name *
                        </label>
                        <input
                          id="restaurantName"
                          type="text"
                          placeholder="Enter your restaurant name"
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={handleNext}
                        disabled={!restaurantName.trim()}
                        className="flex items-center gap-2"
                      >
                        Continue <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}

                {step === "upload" && (
                  <div>
                    <ImageUploader
                      onImagesAdded={handleImagesUploaded}
                      onImageRemoved={handleImageRemoved}
                      existingImages={images}
                    />
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
                    <QRCodeGenerator
                      images={images}
                      onQrGenerated={handleQrGenerated}
                    />
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

            {/* Preview Panel */}
            {(step === "sort" || step === "generate") && images.length > 0 && (
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Menu Preview</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPreview(!showPreview)}
                          className="lg:hidden"
                        >
                          <Eye size={16} />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        How customers will see your menu
                      </p>
                    </div>
                    <div
                      className={`p-4 ${showPreview ? "block" : "hidden lg:block"}`}
                    >
                      <PhotoMenuPreview
                        images={images}
                        restaurantName={restaurantName || "Your Restaurant"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
