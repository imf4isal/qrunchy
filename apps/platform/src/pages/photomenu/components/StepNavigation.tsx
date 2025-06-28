import type {Step} from "@/pages/photomenu/hooks/usePhotoMenuSteps.ts";

interface StepNavigationProps {
    step: Step;
    onBack: () => void;
    onNext: () => void;
    canProceed: boolean;
    showBack?: boolean;
    showNext?: boolean;
}

export default function StepNavigation({
                                           step,
                                           onBack,
                                           onNext,
                                           canProceed,
                                           showBack = true,
                                           showNext = true,
                                       }: StepNavigationProps) {
    const shouldShowBack = showBack && step !== "setup";
    const shouldShowNext = showNext && step !== "generate";

    if (!shouldShowBack && !shouldShowNext) {
        return null;
    }

    return (
        <div className="mt-8 flex justify-between">
            {shouldShowBack ? (
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft size={16} /> Back
                </Button>
            ) : (
                <div></div>
            )}

            {shouldShowNext && (
                <Button
                    onClick={onNext}
                    disabled={!canProceed}
                    className="flex items-center gap-2"
                >
                    Continue <ArrowRight size={16} />
                </Button>
            )}
        </div>
    );
}
