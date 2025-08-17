import { useState } from "react";

export type Step = "setup" | "upload" | "sort" | "generate";

export function usePhotoMenuSteps() {
    const [step, setStep] = useState<Step>("setup");
    const [qrGenerated, setQrGenerated] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());

    const handleNext = () => {
        // Mark current step as completed before moving to next
        setCompletedSteps(prev => new Set([...prev, step]));
        
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
            // Remove upload from completed steps when going back
            setCompletedSteps(prev => {
                const newSet = new Set(prev);
                newSet.delete("upload");
                return newSet;
            });
        } else if (step === "sort") {
            setStep("upload");
            // Remove sort from completed steps when going back
            setCompletedSteps(prev => {
                const newSet = new Set(prev);
                newSet.delete("sort");
                return newSet;
            });
        } else if (step === "generate") {
            setStep("sort");
            // reset qr generation state when going back from a generate step
            setQrGenerated(false);
            // Remove generate from completed steps when going back
            setCompletedSteps(prev => {
                const newSet = new Set(prev);
                newSet.delete("generate");
                return newSet;
            });
        }
    };

    const handleQrGenerated = () => {
        setQrGenerated(true);
    };

    const getProgressWidth = () => {
        if (step === "setup") return "0%";
        if (step === "upload") return "33.33%";
        if (step === "sort") return "66.66%";
        if (qrGenerated) return "calc(100% - 25px)";
        return "100%";
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
        completedSteps,
        handleNext,
        handleBack,
        handleQrGenerated,
        getProgressWidth,
        getStepDescription,
    };
}