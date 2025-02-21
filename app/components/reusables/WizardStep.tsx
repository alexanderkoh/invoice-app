"use client";

import { useWizard } from "react-use-wizard";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { ArrowLeft, ArrowRight } from "lucide-react";

type WizardStepProps = {
    children: React.ReactNode;
};

const WizardStep = ({ children }: WizardStepProps) => {
    const {
        isFirstStep,
        isLastStep,
        previousStep,
        nextStep,
        activeStep,
        stepCount,
    } = useWizard();

    return (
        <div className="space-y-8 animate-in fade-in-50 slide-in-from-right-8 duration-500">
            {children}
            
            <div className="flex items-center justify-between pt-4 border-t">
                <BaseButton
                    type="button"
                    variant="outline"
                    onClick={previousStep}
                    disabled={isFirstStep}
                    className="transition-all duration-200"
                    style={{ 
                        opacity: isFirstStep ? 0 : 1,
                        transform: isFirstStep ? 'translateX(-10px)' : 'none'
                    }}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </BaseButton>

                <BaseButton
                    type="button"
                    onClick={nextStep}
                    disabled={isLastStep}
                    className="transition-all duration-200"
                    style={{ 
                        opacity: isLastStep ? 0 : 1,
                        transform: isLastStep ? 'translateX(10px)' : 'none'
                    }}
                >
                    {isLastStep ? 'Finish' : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </BaseButton>
            </div>
        </div>
    );
};

export default WizardStep; 