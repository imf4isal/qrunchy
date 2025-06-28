import { useState } from "react";
import { usePhotoMenuSteps } from "./hooks/usePhotoMenuSteps";
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
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [restaurantName, setRestaurantName] = useState("");

  const {
    step,
    qrGenerated,
    handleNext,
    handleBack,
    handleQrGenerated,
    getProgressWidth,
    getStepDescription,
  } = usePhotoMenuSteps();

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
        return <GenerateStep images={images} onQrGenerated={handleQrGenerated} />;
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