import { type Step } from "../hooks/usePhotoMenuSteps";
import type {ReactNode} from "react";

interface StepConfig {
    key: Step | "qr";
    label: string;
    icon: ReactNode;
    activeIcon: ReactNode;
}

interface ProgressIndicatorProps {
    step: Step;
    qrGenerated: boolean;
    completedSteps: Set<Step>;
    progressWidth: string;
    description: string;
}

const CheckIcon = () => (
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
);

const SetupIcon = () => (
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
);

const UploadIcon = () => (
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
);

const ArrangeIcon = () => (
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
);

const QRIcon = () => (
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
);

export default function ProgressIndicator({
                                              step,
                                              qrGenerated,
                                              completedSteps,
                                              progressWidth,
                                              description,
                                          }: ProgressIndicatorProps) {
    const stepConfigs: StepConfig[] = [
        {
            key: "setup",
            label: "Setup",
            icon: <SetupIcon />,
            activeIcon: <CheckIcon />,
        },
        {
            key: "upload",
            label: "Upload",
            icon: <UploadIcon />,
            activeIcon: <CheckIcon />,
        },
        {
            key: "sort",
            label: "Arrange",
            icon: <ArrangeIcon />,
            activeIcon: <CheckIcon />,
        },
        {
            key: "qr",
            label: "QR Code",
            icon: <QRIcon />,
            activeIcon: <CheckIcon />,
        },
    ];

    const getStepState = (stepKey: string) => {
        if (stepKey === "qr") {
            return qrGenerated ? "completed" : step === "generate" ? "current" : "inactive";
        }
        
        // For regular steps, check if completed first
        if (completedSteps.has(stepKey as Step)) {
            return "completed";
        }
        
        // Then check if it's the current step
        if (step === stepKey) {
            return "current";
        }
        
        // Otherwise it's inactive
        return "inactive";
    };

    const getStepStyles = (state: string) => {
        switch (state) {
            case "current":
                return "border-blue-500 bg-white text-blue-500";
            case "completed":
                return "border-blue-500 bg-blue-500 text-white";
            case "inactive":
            default:
                return "border-gray-200 bg-white text-gray-400";
        }
    };

    const getTextStyles = (state: string) => {
        switch (state) {
            case "current":
            case "completed":
                return "text-blue-600";
            case "inactive":
            default:
                return "text-gray-500";
        }
    };

    return (
        <div className="mb-16">
            <div className="relative">
                <div className="absolute left-5 right-5 top-7 h-1 bg-gray-100 rounded-full"></div>

                <div
                    className="absolute left-5 top-7 h-1 bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                        width: progressWidth,
                        maxWidth: "calc(100% - 25px)",
                    }}
                ></div>

                <div className="relative flex justify-between">
                    {stepConfigs.map((stepConfig) => {
                        const state = getStepState(stepConfig.key);
                        return (
                            <div key={stepConfig.key} className="flex flex-col items-center z-10">
                                <div
                                    className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300 ${getStepStyles(state)}`}
                                >
                                    {state === "completed" ? stepConfig.activeIcon : stepConfig.icon}
                                </div>
                                <span
                                    className={`font-medium text-sm mt-3 transition-colors duration-300 ${getTextStyles(state)}`}
                                >
                  {stepConfig.label}
                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* step description */}
            <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </div>
    );
}