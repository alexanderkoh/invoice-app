"use client";

import React from "react";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { Percent, RefreshCw } from "lucide-react";

// Types
import { NameType } from "@/types";

type ChargeInputProps = {
    label: string;
    name: NameType;
    switchAmountType: (
        type: string,
        setType: React.Dispatch<React.SetStateAction<string>>
    ) => void;
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>;
    currency: string;
};

const ChargeInput = ({
    label,
    name,
    switchAmountType,
    type,
    setType,
    currency,
}: ChargeInputProps) => {
    const { control } = useFormContext();

    return (
        <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="flex items-center justify-between sm:w-1/3">
                    <div className="text-sm font-medium leading-none">{label}</div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <BaseButton
                            variant="ghost"
                            size="icon"
                            onClick={() => switchAmountType(type, setType)}
                            className="h-9 w-9 rounded-lg transition-colors hover:bg-accent/10"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </BaseButton>

                        <div className="flex-1">
                            <FormField
                                control={control}
                                name={name}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    className="pr-8 transition-colors focus-visible:ring-1"
                                                    placeholder={label}
                                                    type="number"
                                                    min="0"
                                                    max="1000000"
                                                />
                                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                    {type === "percentage" ? (
                                                        <Percent className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">{currency}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChargeInput;
