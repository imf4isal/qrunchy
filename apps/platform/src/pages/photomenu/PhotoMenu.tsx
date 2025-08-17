import { useState, useEffect } from "react";
import { usePhotoMenuSteps } from "./hooks/usePhotoMenuSteps";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useAuth } from "@/contexts/AuthContext";
import PhotoMenuLayout from "./components/PhotoMenuLayout";
import ProgressIndicator from "./components/ProgressIndicator";
import StepNavigation from "./components/StepNavigation";
import SetupStep from "./components/SetupStep";
import UploadStep from "./components/UploadStep";
import SortStep from "./components/SortStep";
import GenerateStep from "./components/GenerateStep";
import MenuPreviewPanel from "./components/MenuPreviewPanel";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export default function PhotoMenu() {
  const { currentRestaurant, clearRestaurant } = useRestaurant();
  const { chains } = useAuth();
  
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [restaurantName, setRestaurantName] = useState(currentRestaurant?.name || "");
  const [selectedChain, setSelectedChain] = useState<number | null>((currentRestaurant as any)?.group_res_id || null);
  const [createdRestaurantId, setCreatedRestaurantId] = useState<number | null>(currentRestaurant?.id || null);
  const [hasDraft, setHasDraft] = useState(false);
  const [componentKey, setComponentKey] = useState(0);

  const {
    step,
    qrGenerated,
    completedSteps,
    handleNext,
    handleBack,
    handleQrGenerated,
    getProgressWidth,
    getStepDescription,
  } = usePhotoMenuSteps();

  // Save draft to localStorage whenever any form data changes
  useEffect(() => {
    if (!currentRestaurant) { // Only save drafts for new restaurants
      // Only save if there's meaningful data AND we're past the setup step
      // This prevents saving draft immediately on setup step, allowing clean start
      const hasData = restaurantName || images.length > 0;
      const isAfterSetup = step !== "setup";
      
      if (hasData && isAfterSetup) {
        const draftData = {
          step,
          restaurantName,
          selectedChain,
          images: images.map(img => ({
            id: img.id,
            preview: img.preview,
            // Note: Cannot persist File objects, will need to re-upload
          })),
          timestamp: new Date().toISOString()
        };
        console.log('💾 Saving photomenu draft:', {
          restaurantName: restaurantName,
          restaurantNameLength: restaurantName.length,
          selectedChain: selectedChain,
          imagesCount: images.length,
          step: step
        });
        localStorage.setItem('qrunchy_photomenu_draft', JSON.stringify(draftData));
      }
    }
  }, [step, restaurantName, selectedChain, images, currentRestaurant]);

  // Reset state when user returns to create new menu after completing one
  useEffect(() => {
    // Only for new restaurant creation (not editing existing)
    if (!currentRestaurant) {
      const draftStr = localStorage.getItem('qrunchy_photomenu_draft');
      
      console.log('🔍 Checking if state should be reset:', {
        hasDraft: !!draftStr,
        currentRestaurantName: restaurantName,
        step: step,
        qrGenerated: qrGenerated
      });
      
      if (!draftStr) {
        // No draft exists, check if we have stale state data
        const hasStaleData = restaurantName || selectedChain || images.length > 0 || createdRestaurantId;
        
        if (hasStaleData) {
          console.log('🧹 No draft but stale state detected - resetting for fresh start');
          resetToCleanState();
        }
      } else {
        // Draft exists, validate it
        try {
          const draft = JSON.parse(draftStr);
          const hasValidData = draft.restaurantName && draft.restaurantName.trim();
          const isRecent = draft.timestamp ? 
            (new Date().getTime() - new Date(draft.timestamp).getTime()) < 24 * 60 * 60 * 1000 : 
            false;
          
          if (hasValidData && isRecent) {
            setHasDraft(true);
            console.log('💡 Valid draft found');
          } else {
            // Invalid/old draft, clear it and reset state
            localStorage.removeItem('qrunchy_photomenu_draft');
            console.log('🗑️ Cleared invalid draft and resetting state');
            resetToCleanState();
          }
        } catch (error) {
          console.error('❌ Error parsing draft:', error);
          localStorage.removeItem('qrunchy_photomenu_draft');
          resetToCleanState();
        }
      }
    }
  }, [componentKey]); // Only run when componentKey changes or on mount
  
  // Force component to re-check state when user navigates back
  useEffect(() => {
    if (!currentRestaurant && step === "setup") {
      setComponentKey(prev => prev + 1);
    }
  }, [currentRestaurant, step]);
  
  // Helper function to reset to clean state
  const resetToCleanState = () => {
    console.log('🧹 Resetting to clean state');
    setRestaurantName("");
    setSelectedChain(null);
    setImages([]);
    setCreatedRestaurantId(null);
    setHasDraft(false);
  };

  const restoreDraft = () => {
    const draftStr = localStorage.getItem('qrunchy_photomenu_draft');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        console.log('🔄 Restoring photomenu draft:', draft);
        
        setRestaurantName(draft.restaurantName || "");
        setSelectedChain(draft.selectedChain || null);
        
        // Note: Cannot restore images as File objects are not serializable
        setHasDraft(false);
        
        console.log('✅ Photomenu draft restored:', {
          restaurantName: draft.restaurantName || "",
          selectedChain: draft.selectedChain || null
        });
      } catch (error) {
        console.error('❌ Error restoring photomenu draft:', error);
        localStorage.removeItem('qrunchy_photomenu_draft');
      }
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('qrunchy_photomenu_draft');
    setHasDraft(false);
    console.log('🗑️ User cleared photomenu draft manually');
  };
  
  // Add function to explicitly start fresh (clear everything and reset)
  const startFresh = () => {
    localStorage.removeItem('qrunchy_photomenu_draft');
    setHasDraft(false);
    setRestaurantName("");
    setSelectedChain(null);
    setImages([]);
    console.log('🆕 User started fresh photomenu creation');
  };

  const handleImagesUploaded = (newImages: UploadedImage[]) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleImageRemoved = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);

      // revoke the object url to prevent memory leaks
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return prev.filter((img) => img.id !== id);
    });
  };

  const getCanProceed = () => {
    switch (step) {
      case "setup":
        return restaurantName.trim() !== "";
      case "upload":
        return images.length > 0;
      case "sort":
        return true;
      case "generate":
        return false;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "setup":
        return (
            <SetupStep
                restaurantName={restaurantName}
                onRestaurantNameChange={setRestaurantName}
                selectedChain={selectedChain}
                onChainChange={setSelectedChain}
                chains={chains}
            />
        );
      case "upload":
        return (
            <UploadStep
                images={images}
                onImagesAdded={handleImagesUploaded}
                onImageRemoved={handleImageRemoved}
            />
        );
      case "sort":
        return <SortStep images={images} onImagesChange={setImages} />;
      case "generate":
        return (
          <GenerateStep 
            images={images} 
            restaurantId={createdRestaurantId || 0} // Will be created during QR generation if 0
            restaurantName={restaurantName}
            selectedChain={selectedChain}
            onQrGenerated={(restaurantId: number) => {
              setCreatedRestaurantId(restaurantId);
              clearDraft(); // Clear draft after successful QR generation
              handleQrGenerated();
            }}
          />
        );
      default:
        return null;
    }
  };

  const shouldShowPreview = (step === "sort" || step === "generate") && images.length > 0;
  const sidePanel = shouldShowPreview ? (
      <MenuPreviewPanel images={images} restaurantName={restaurantName} />
  ) : undefined;

  return (
      <PhotoMenuLayout sidePanel={sidePanel}>
        {/* Draft restoration notification */}
        {hasDraft && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Saved Draft Found
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  We found a saved draft with your restaurant details. Restore it to continue where you left off.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={restoreDraft}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                  >
                    Restore Draft
                  </button>
                  <button
                    onClick={startFresh}
                    className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:border-blue-400"
                  >
                    Start Fresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ProgressIndicator
            step={step}
            qrGenerated={qrGenerated}
            completedSteps={completedSteps}
            progressWidth={getProgressWidth()}
            description={getStepDescription()}
        />

        {renderStepContent()}

        <StepNavigation
            step={step}
            onBack={handleBack}
            onNext={handleNext}
            canProceed={getCanProceed()}
        />
      </PhotoMenuLayout>
  );
}