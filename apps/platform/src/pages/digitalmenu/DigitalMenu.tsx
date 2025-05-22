// src/pages/digitalmenu/DigitalMenu.tsx
import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MenuBuilder from "./MenuBuilder";
import MenuPreview from "./MenuPreview";
import QRGenerator from "./QRGenerator";
import type { DigitalMenu, Category, MenuItem } from "@/types/digitalMenu";

export default function DigitalMenu() {
  const [step, setStep] = useState<"setup" | "build" | "generate">("setup");
  const [menu, setMenu] = useState<DigitalMenu>({
    restaurantName: "",
    categories: [],
    items: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  const handleNext = () => {
    if (step === "setup") {
      setStep("build");
    } else if (step === "build") {
      setStep("generate");
    }
  };

  const handleBack = () => {
    if (step === "build") {
      setStep("setup");
    } else if (step === "generate") {
      setStep("build");
      setQrGenerated(false);
    }
  };

  const handleRestaurantNameChange = (name: string) => {
    setMenu((prev) => ({ ...prev, restaurantName: name }));
  };

  const handleCategoriesChange = (categories: Category[]) => {
    setMenu((prev) => ({ ...prev, categories }));
  };

  const handleItemsChange = (items: MenuItem[]) => {
    setMenu((prev) => ({ ...prev, items }));
  };

  const handleQrGenerated = () => {
    setQrGenerated(true);
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
              Create Digital Menu
            </h1>
            <p className="mt-2 text-gray-600">
              Build a beautiful, structured menu with categories, items, and
              variants
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-16">
            <div className="relative">
              <div className="absolute left-5 right-5 top-7 h-1 bg-gray-100 rounded-full"></div>
              <div
                className="absolute left-5 top-7 h-1 bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width:
                    step === "setup"
                      ? "0%"
                      : step === "build"
                        ? "50%"
                        : qrGenerated
                          ? "calc(100% - 25px)"
                          : "67%",
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
                          : step === "build" || step === "generate"
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-200 bg-white text-gray-400"
                      }`}
                  >
                    {step === "build" || step === "generate" ? (
                      <svg
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
                    className={`font-medium text-sm mt-3 transition-colors duration-300 ${
                      step === "setup" ||
                      step === "build" ||
                      step === "generate"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    Setup
                  </span>
                </div>

                {/* Build */}
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300
                      ${
                        step === "build"
                          ? "border-blue-500 bg-white text-blue-500"
                          : step === "generate"
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-200 bg-white text-gray-400"
                      }`}
                  >
                    {step === "generate" ? (
                      <svg
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
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`font-medium text-sm mt-3 transition-colors duration-300 ${
                      step === "build" || step === "generate"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    Build Menu
                  </span>
                </div>

                {/* Generate QR */}
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
                    className={`font-medium text-sm mt-3 transition-colors duration-300 ${
                      step === "generate" ? "text-blue-600" : "text-gray-500"
                    }`}
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
                  : step === "build"
                    ? "Add categories and menu items with variants and add-ons"
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
                        <Input
                          id="restaurantName"
                          type="text"
                          placeholder="Enter your restaurant name"
                          value={menu.restaurantName}
                          onChange={(e) =>
                            handleRestaurantNameChange(e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={handleNext}
                        disabled={!menu.restaurantName.trim()}
                        className="flex items-center gap-2"
                      >
                        Continue <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}

                {step === "build" && (
                  <div>
                    <MenuBuilder
                      menu={menu}
                      onCategoriesChange={handleCategoriesChange}
                      onItemsChange={handleItemsChange}
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
                        disabled={
                          menu.categories.length === 0 ||
                          menu.items.length === 0
                        }
                        className="flex items-center gap-2"
                      >
                        Continue <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}

                {step === "generate" && (
                  <div>
                    <QRGenerator
                      menu={menu}
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
            {(step === "build" || step === "generate") && (
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Live Preview</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPreview(!showPreview)}
                          className="lg:hidden"
                        >
                          <Eye size={16} />
                        </Button>
                      </div>
                    </div>
                    <div
                      className={`${showPreview ? "block" : "hidden lg:block"}`}
                    >
                      <MenuPreview menu={menu} />
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
