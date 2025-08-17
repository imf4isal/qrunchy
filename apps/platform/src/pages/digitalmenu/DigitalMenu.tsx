// src/pages/digitalmenu/DigitalMenu.tsx
import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, ArrowRight, Eye, Building2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MenuBuilder from "./MenuBuilder";
import ThemePreview from "@/components/ThemePreview";
import QRGenerator from "./QRGenerator";
import ThemeSetupSelector from "@/components/ThemeSetupSelector";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDigitalMenuSteps } from "./hooks/useDigitalMenuSteps";
import type { DigitalMenu, Category, MenuItem } from "@/types/digitalMenu";

export default function DigitalMenu() {
  const { currentRestaurant, clearRestaurant } = useRestaurant();
  const { chains } = useAuth();
  const {
    step,
    qrGenerated,
    completedSteps,
    handleNext,
    handleBack,
    handleQrGenerated,
    getProgressWidth,
    getStepDescription,
    setStep,
    setQrGenerated,
    setCompletedSteps,
  } = useDigitalMenuSteps();
  const [selectedChain, setSelectedChain] = useState<number | null>((currentRestaurant as any)?.group_res_id || null);
  const [menu, setMenu] = useState<DigitalMenu>({
    restaurantName: currentRestaurant?.name || "",
    categories: [],
    items: [],
  });
  const [selectedTheme, setSelectedTheme] = useState<"minimal" | "modern">("minimal");
  const [showPreview, setShowPreview] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // Save draft to localStorage whenever any form data changes
  useEffect(() => {
    if (!currentRestaurant) { // Only save drafts for new restaurants
      // Only save if there's meaningful data
      const hasData = menu.restaurantName || 
                     (menu.categories && menu.categories.length > 0) ||
                     (menu.items && menu.items.length > 0);
      
      if (hasData) {
        const draftData = {
          step,
          menu,
          selectedTheme,
          selectedChain,
          timestamp: new Date().toISOString()
        };
        console.log('Saving draft:', draftData); // Debug log
        localStorage.setItem('qrunchy_menu_draft', JSON.stringify(draftData));
      }
    } else {
      console.log('Not saving draft - currentRestaurant exists:', currentRestaurant); // Debug log
    }
  }, [step, menu, selectedTheme, selectedChain, currentRestaurant]);

  // Load draft from localStorage on component mount
  useEffect(() => {
    console.log('Loading draft - currentRestaurant:', currentRestaurant); // Debug log
    if (!currentRestaurant) { // Only load drafts for new restaurants
      const draft = localStorage.getItem('qrunchy_menu_draft');
      console.log('Found draft in localStorage:', draft); // Debug log
      if (draft) {
        try {
          const draftData = JSON.parse(draft);
          console.log('Parsed draft data:', draftData); // Debug log
          // Only show draft notification if there's meaningful data
          const hasData = draftData.menu?.restaurantName || 
                         (draftData.menu?.categories && draftData.menu.categories.length > 0) ||
                         (draftData.menu?.items && draftData.menu.items.length > 0);
          
          console.log('Has meaningful data:', hasData); // Debug log
          if (hasData) {
            console.log('Restoring draft data'); // Debug log
            setStep(draftData.step || "setup");
            setMenu({
              restaurantName: draftData.menu?.restaurantName || "",
              categories: draftData.menu?.categories || [],
              items: draftData.menu?.items || []
            });
            setSelectedTheme(draftData.selectedTheme || "minimal");
            setSelectedChain(draftData.selectedChain || null);
            setHasDraft(true);
          } else {
            console.log('No meaningful data, cleaning up draft'); // Debug log
            // Clean up empty draft
            localStorage.removeItem('qrunchy_menu_draft');
          }
        } catch (error) {
          console.error('Failed to load menu draft:', error);
          localStorage.removeItem('qrunchy_menu_draft');
        }
      } else {
        console.log('No draft found in localStorage'); // Debug log
      }
    } else {
      console.log('Not loading draft - currentRestaurant exists'); // Debug log
    }
  }, [currentRestaurant]);


  const handleRestaurantNameChange = (name: string) => {
    setMenu((prev) => ({ ...prev, restaurantName: name }));
  };

  const handleCategoriesChange = useCallback((categories: Category[]) => {
    setMenu((prev) => ({ ...prev, categories }));
  }, []);

  const handleItemsChange = useCallback((items: MenuItem[]) => {
    setMenu((prev) => ({ ...prev, items }));
  }, []);

  const handleStartFresh = () => {
    // Clear restaurant context
    clearRestaurant();
    
    // Reset all form state
    setStep("setup");
    setMenu({
      restaurantName: "",
      categories: [],
      items: [],
    });
    setSelectedTheme("minimal");
    setSelectedChain(null);
    setQrGenerated(false);
    setCompletedSteps(new Set());
    setHasDraft(false);
    
    // Clear draft from localStorage
    localStorage.removeItem('qrunchy_menu_draft');
  };

  const getStepState = (stepKey: string) => {
    if (stepKey === "qr") {
      return qrGenerated ? "completed" : step === "generate" ? "current" : "inactive";
    }
    
    // For regular steps, check if completed first
    if (completedSteps.has(stepKey as any)) {
      return "completed";
    }
    
    // Then check if it's the current step
    if (step === stepKey) {
      return "current";
    }
    
    // Otherwise it's inactive
    return "inactive";
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
            
            {hasDraft && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-800">Draft Restored</span>
                </div>
                <p className="text-sm text-blue-600 mb-3">
                  Your previous work has been automatically restored. Continue where you left off or start fresh.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartFresh}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <RefreshCw size={14} className="mr-2" />
                  Start from scratch
                </Button>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-16">
            <div className="relative">
              <div className="absolute left-5 right-5 top-7 h-1 bg-gray-100 rounded-full"></div>
              <div
                className="absolute left-5 top-7 h-1 bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: getProgressWidth(),
                  maxWidth: "calc(100% - 25px)",
                }}
              ></div>

              <div className="relative flex justify-between">
                {/* Setup */}
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300
                      ${
                        getStepState("setup") === "current"
                          ? "border-blue-500 bg-white text-blue-500"
                          : getStepState("setup") === "completed"
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-200 bg-white text-gray-400"
                      }`}
                  >
                    {getStepState("setup") === "completed" ? (
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
                      getStepState("setup") === "current" || getStepState("setup") === "completed"
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
                        getStepState("build") === "current"
                          ? "border-blue-500 bg-white text-blue-500"
                          : getStepState("build") === "completed"
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-200 bg-white text-gray-400"
                      }`}
                  >
                    {getStepState("build") === "completed" ? (
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
                      getStepState("build") === "current" || getStepState("build") === "completed"
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
                        getStepState("qr") === "completed"
                          ? "border-blue-500 bg-blue-500 text-white"
                          : getStepState("qr") === "current"
                            ? "border-blue-500 bg-white text-blue-500"
                            : "border-gray-200 bg-white text-gray-400"
                      }`}
                  >
                    {getStepState("qr") === "completed" ? (
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
                      getStepState("qr") === "current" || getStepState("qr") === "completed"
                        ? "text-blue-600"
                        : "text-gray-500"
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
                {getStepDescription()}
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
                    <h2 className="text-2xl font-bold mb-4">
                      What's your restaurant called?
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Get started in seconds - just your restaurant name and you're ready to build!
                    </p>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="restaurantName" className="text-sm font-medium text-gray-700 mb-2 block">
                          Restaurant Name
                        </Label>
                        <Input
                          id="restaurantName"
                          type="text"
                          placeholder="e.g. Mario's Pizza, Sunset Cafe, The Local Bistro"
                          value={menu.restaurantName}
                          onChange={(e) =>
                            handleRestaurantNameChange(e.target.value)
                          }
                          className="w-full text-lg py-3"
                        />
                      </div>

                      {chains && chains.length > 0 && (
                        <div>
                          <Label htmlFor="chainSelect" className="text-sm font-medium text-gray-700 mb-2 block">
                            Restaurant Chain (Optional)
                          </Label>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-blue-300 transition-colors">
                              <input
                                type="radio"
                                id="no-chain"
                                name="chain"
                                value=""
                                checked={selectedChain === null}
                                onChange={() => setSelectedChain(null)}
                                className="h-4 w-4 text-blue-600"
                              />
                              <label htmlFor="no-chain" className="flex-1 text-sm font-medium text-gray-700">
                                Individual restaurant (not part of a chain)
                              </label>
                            </div>
                            
                            {chains?.map((chain) => (
                              <div key={chain.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:border-blue-300 transition-colors">
                                <input
                                  type="radio"
                                  id={`chain-${chain.id}`}
                                  name="chain"
                                  value={chain.id}
                                  checked={selectedChain === chain.id}
                                  onChange={() => setSelectedChain(chain.id)}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <div className="flex-1">
                                  <label htmlFor={`chain-${chain.id}`} className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer">
                                    <Building2 className="w-4 h-4 text-blue-600" />
                                    <span>{chain.name}</span>
                                  </label>
                                  {chain.description && (
                                    <p className="text-xs text-gray-500 mt-1 ml-6">{chain.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Select a chain to group this restaurant with your other locations for better organization.
                          </p>
                        </div>
                      )}
                    </div>


                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={handleNext}
                        disabled={!menu.restaurantName.trim()}
                        className="flex items-center gap-2 px-6 py-3"
                      >
                        Let's Build Your Menu <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}

                {step === "build" && (
                  <div>
                    <div className="mb-8">
                      <ThemeSetupSelector
                        selectedTheme={selectedTheme}
                        onThemeChange={setSelectedTheme}
                      />
                    </div>

                    <MenuBuilder
                      menu={menu}
                      restaurantId={currentRestaurant?.id}
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
                          !menu.categories || menu.categories.length === 0 ||
                          !menu.items || menu.items.length === 0
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
                      restaurantId={currentRestaurant?.id}
                      selectedTheme={selectedTheme}
                      selectedChain={selectedChain}
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
                      <ThemePreview menu={menu} theme={selectedTheme} />
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
