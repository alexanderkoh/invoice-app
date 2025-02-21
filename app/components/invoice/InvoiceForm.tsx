"use client";

import { useMemo } from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// ShadCn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// React Wizard
import { Wizard, useWizard } from "react-use-wizard";

// Components
import {
    WizardStep,
    BillFromSection,
    BillToSection,
    InvoiceDetails,
    Items,
    PaymentInformation,
    InvoiceSummary,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

const WizardHeader = ({ steps }: { steps: any[] }) => {
    const { activeStep } = useWizard();
    const progress = ((activeStep + 1) / steps.length) * 100;

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                        {steps[activeStep].title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {steps[activeStep].description}
                    </p>
                </div>
                <Badge variant="outline" className="h-6">
                    Step {activeStep + 1} of {steps.length}
                </Badge>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

const InvoiceForm = () => {
    const { _t } = useTranslationContext();
    const { control } = useFormContext();

    // Get invoice number variable
    const invoiceNumber = useWatch({
        name: "details.invoiceNumber",
        control,
    });

    const invoiceNumberLabel = useMemo(() => {
        if (invoiceNumber) {
            return `#${invoiceNumber}`;
        } else {
            return _t("form.newInvBadge");
        }
    }, [invoiceNumber]);

    const steps = [
        {
            title: "Billing Information",
            description: "Enter sender and receiver details",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BillFromSection />
                    <BillToSection />
                </div>
            ),
        },
        {
            title: "Invoice Details",
            description: "Set invoice number, dates and currency",
            content: (
                <div className="space-y-8">
                    <InvoiceDetails />
                </div>
            ),
        },
        {
            title: "Items",
            description: "Add items and their details",
            content: <Items />,
        },
        {
            title: "Payment Information",
            description: "Add payment details and methods",
            content: <PaymentInformation />,
        },
        {
            title: "Summary",
            description: "Review and finalize invoice details",
            content: <InvoiceSummary />,
        },
    ];

    return (
        <div className="h-full">
            <Card className="h-full">
                <CardHeader className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <CardTitle className="flex items-center gap-3">
                            <span className="uppercase">
                                {_t("form.title")}
                            </span>
                        </CardTitle>
                        <Badge variant="secondary" className="w-fit">
                            <p className="text-sm">{invoiceNumberLabel}</p>
                        </Badge>
                    </div>
                    <CardDescription>{_t("form.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <Wizard header={<WizardHeader steps={steps} />}>
                            {steps.map((step, index) => (
                                <WizardStep key={index}>
                                    {step.content}
                                </WizardStep>
                            ))}
                        </Wizard>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceForm;
