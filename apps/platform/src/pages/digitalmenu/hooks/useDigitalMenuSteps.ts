import { useState } from "react";

export type DigitalMenuStep = "setup" | "build" | "generate";

export function useDigitalMenuSteps() {
    const [step, setStep] = useState<DigitalMenuStep>("setup");
    const [qrGenerated, setQrGenerated] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<Set<DigitalMenuStep>>(new Set());

    const handleNext = () => {
        // Mark current step as completed before moving to next
        setCompletedSteps(prev => new Set([...prev, step]));
        
        if (step === "setup") {
            setStep("build");
        } else if (step === "build") {
            setStep("generate");
        }
    };

    const handleBack = () => {
        if (step === "build") {
            setStep("setup");
            // Remove build from completed steps when going back
            setCompletedSteps(prev => {
                const newSet = new Set(prev);
                newSet.delete("build");
                return newSet;
            });
        } else if (step === "generate") {
            setStep("build");
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
        if (step === "build") return "50%";
        if (qrGenerated) return "calc(100% - 25px)";
        return "67%";
    };

    const getStepDescription = () => {
        switch (step) {
            case "setup":
                return "Just tell us your restaurant name to get started";
            case "build":
                return "Choose your theme and build your menu - add categories, items, variants and add-ons";
            case "generate":
                return qrGenerated
                    ? "Your QR code is ready! Share it with customers"
                    : "Ready to go live? Create your account and generate QR code";
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
        setStep,
        setQrGenerated,
        setCompletedSteps,
    };
}