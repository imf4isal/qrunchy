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

  const {
    step,
    qrGenerated,
    handleNext,
    handleBack,
    handleQrGenerated,
    getProgressWidth,
    getStepDescription,
  } = usePhotoMenuSteps();

  // Save draft to localStorage whenever any form data changes
  useEffect(() => {
    if (!currentRestaurant) { // Only save drafts for new restaurants
      // Only save if there's meaningful data
      const hasData = restaurantName || images.length > 0;
      
      if (hasData) {
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
        console.log('Saving photomenu draft:', draftData);
        localStorage.setItem('qrunchy_photomenu_draft', JSON.stringify(draftData));
      }
    }
  }, [step, restaurantName, selectedChain, images, currentRestaurant]);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!currentRestaurant) { // Only load drafts for new restaurants
      const draftStr = localStorage.getItem('qrunchy_photomenu_draft');
      if (draftStr) {
        try {
          const draft = JSON.parse(draftStr);
          console.log('Found photomenu draft:', draft);
          setHasDraft(true);
          // Note: Don't auto-restore, let user choose
        } catch (error) {
          console.error('Error parsing photomenu draft:', error);
          localStorage.removeItem('qrunchy_photomenu_draft');
        }
      }
    }
  }, [currentRestaurant]);

  const restoreDraft = () => {
    const draftStr = localStorage.getItem('qrunchy_photomenu_draft');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        setRestaurantName(draft.restaurantName || "");
        setSelectedChain(draft.selectedChain || null);
        // Note: Cannot restore images as File objects are not serializable
        setHasDraft(false);
        console.log('Restored photomenu draft');
      } catch (error) {
        console.error('Error restoring photomenu draft:', error);
        localStorage.removeItem('qrunchy_photomenu_draft');
      }
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('qrunchy_photomenu_draft');
    setHasDraft(false);
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
        return restaurantName.trim() !== "" && selectedTheme !== null;
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-blue-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-blue-800">
                  We found a saved draft of your photo menu. Would you like to restore it?
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={restoreDraft}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Restore
                </button>
                <button
                  onClick={clearDraft}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <ProgressIndicator
            step={step}
            qrGenerated={qrGenerated}
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