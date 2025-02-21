"use client";

import { useFormContext, useWatch } from "react-hook-form";

// Components
import { FormInput, Subheading } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

// ShadCn
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// Types
import { InvoiceType } from "@/types";

// Icons
import { Info } from "lucide-react";

const PaymentInformation = () => {
    const { _t } = useTranslationContext();
    const { control, setValue } = useFormContext<InvoiceType>();

    const paymentType = useWatch({
        name: "details.paymentInformation.paymentType",
        control,
    });

    const stellarCurrency = useWatch({
        name: "details.paymentInformation.currency",
        control,
    });

    const handlePaymentTypeChange = (value: 'bankTransfer' | 'stellar') => {
        setValue("details.paymentInformation", value === "bankTransfer" 
            ? {
                paymentType: "bankTransfer",
                bankName: "",
                accountName: "",
                accountNumber: "",
            }
            : {
                paymentType: "stellar",
                publicKey: "",
                memo: "",
                currency: "XLM",
            }
        );
    };

    return (
        <section className="space-y-6">
            <Subheading>{_t("form.steps.paymentInfo.heading")}:</Subheading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                    className={`relative flex items-center p-6 cursor-pointer hover:bg-accent/5 ${
                        paymentType === 'bankTransfer' ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handlePaymentTypeChange('bankTransfer')}
                >
                    <div className="flex items-center space-x-4">
                        <RadioGroupItem
                            value="bankTransfer"
                            checked={paymentType === 'bankTransfer'}
                            onChange={() => handlePaymentTypeChange('bankTransfer')}
                        />
                        <Label className="flex-1 cursor-pointer font-semibold">
                            Bank Transfer
                        </Label>
                    </div>
                </Card>

                <Card 
                    className={`relative flex items-center p-6 cursor-pointer hover:bg-accent/5 ${
                        paymentType === 'stellar' ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handlePaymentTypeChange('stellar')}
                >
                    <div className="flex items-center space-x-4">
                        <RadioGroupItem
                            value="stellar"
                            checked={paymentType === 'stellar'}
                            onChange={() => handlePaymentTypeChange('stellar')}
                        />
                        <Label className="flex-1 cursor-pointer font-semibold">
                            Stellar Network
                        </Label>
                    </div>
                </Card>
            </div>

            <div className="mt-6">
                {paymentType === "bankTransfer" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormInput
                            name="details.paymentInformation.bankName"
                            label={_t("form.steps.paymentInfo.bankName")}
                            placeholder={_t("form.steps.paymentInfo.bankName")}
                            vertical
                        />
                        <FormInput
                            name="details.paymentInformation.accountName"
                            label={_t("form.steps.paymentInfo.accountName")}
                            placeholder={_t("form.steps.paymentInfo.accountName")}
                            vertical
                        />
                        <FormInput
                            name="details.paymentInformation.accountNumber"
                            label={_t("form.steps.paymentInfo.accountNumber")}
                            placeholder={_t("form.steps.paymentInfo.accountNumber")}
                            vertical
                        />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <FormInput
                                    name="details.paymentInformation.publicKey"
                                    label="Stellar Public Key"
                                    placeholder="Enter your Stellar public key (starts with G)"
                                    vertical
                                />
                                <Card className="p-3 bg-muted/50 border-muted">
                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                        <Info className="h-4 w-4 flex-shrink-0" />
                                        <p>
                                            Stellar public key must be 56 characters long and start with 'G'.
                                        </p>
                                    </div>
                                </Card>
                            </div>
                            <FormInput
                                name="details.paymentInformation.memo"
                                label="Memo (Optional)"
                                placeholder="Enter memo if required"
                                vertical
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="XLM"
                                    checked={stellarCurrency === 'XLM'}
                                    onChange={() => setValue("details.paymentInformation.currency", "XLM")}
                                />
                                <Label>XLM</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="USDC"
                                    checked={stellarCurrency === 'USDC'}
                                    onChange={() => setValue("details.paymentInformation.currency", "USDC")}
                                />
                                <Label>USDC</Label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PaymentInformation;
