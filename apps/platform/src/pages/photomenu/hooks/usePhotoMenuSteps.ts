import { useState } from "react";

export type Step = "setup" | "upload" | "sort" | "generate";

export function usePhotoMenuSteps() {
    const [step, setStep] = useState<Step>("setup");
    const [qrGenerated, setQrGenerated] = useState(false);

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
            // reset qr generation state when going back from a generate step
            setQrGenerated(false);
        }
    };

    const handleQrGenerated = () => {
        setQrGenerated(true);
    };

    const getProgressWidth = () => {
        if (step === "setup") return "0%";
        if (step === "upload") return "25%";
        if (step === "sort") return "50%";
        if (qrGenerated) return "calc(100% - 25px)";
        return "75%";
    };

    const getStepDescription = () => {
        switch (step) {
            case "setup":
                return "Enter basic information about your restaurant";
            case "upload":
                return "Upload photos of your menu - you can add multiple pages";
            case "sort":
                return "Drag and drop to arrange your menu in the correct order";
            case "generate":
                return qrGenerated
                    ? "Your QR code is ready to share with customers"
                    : "Generate your QR code and make it available to customers";
            default:
                return "";
        }
    };

    return {
        step,
        qrGenerated,
        handleNext,
        handleBack,
        handleQrGenerated,
        getProgressWidth,
        getStepDescription,
    };
}