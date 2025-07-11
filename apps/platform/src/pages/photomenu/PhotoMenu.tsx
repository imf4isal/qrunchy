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
  const [selectedTheme, setSelectedTheme] = useState<"minimal" | "modern">("minimal");
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
          selectedTheme,
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
  }, [step, restaurantName, selectedTheme, selectedChain, images, currentRestaurant]);

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
        setSelectedTheme(draft.selectedTheme || "minimal");
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
            selectedTheme={selectedTheme}
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