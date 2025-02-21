"use client";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

// Hooks
import { useCurrencies } from "@/hooks/useCurrencies";

// Types
import { CurrencyType, NameType } from "@/types";

// Icons
import { Info } from "lucide-react";

type CurrencySelectorProps = {
    name: NameType;
    label?: string;
    placeholder?: string;
};

const CurrencySelector = ({
    name,
    label,
    placeholder,
}: CurrencySelectorProps) => {
    const { control } = useFormContext();
    const { currencies, currenciesLoading } = useCurrencies();

    return (
        <div className="space-y-2">
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                            <div className="flex items-center justify-between sm:w-1/3">
                                {label && (
                                    <FormLabel className="text-sm font-medium leading-none">
                                        {`${label}`}
                                    </FormLabel>
                                )}
                            </div>
                            <div className="flex-1">
                                <Select
                                    {...field}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full transition-colors focus-visible:ring-1">
                                            <SelectValue
                                                placeholder={placeholder}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-[300px]">
                                        <SelectGroup>
                                            <SelectLabel className="sticky top-0 bg-popover z-10 border-b">Popular Currencies</SelectLabel>
                                            {!currenciesLoading &&
                                                currencies?.popular?.map((currency: CurrencyType) => (
                                                    <SelectItem
                                                        key={currency.code}
                                                        value={currency.code}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="font-medium">{currency.code}</span>
                                                        <span className="text-muted-foreground">-</span>
                                                        <span className="text-sm text-muted-foreground">{currency.name}</span>
                                                    </SelectItem>
                                                ))}
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel className="sticky top-0 bg-popover z-10 border-b">All Currencies</SelectLabel>
                                            {!currenciesLoading &&
                                                currencies?.all?.map((currency: CurrencyType) => (
                                                    <SelectItem
                                                        key={currency.code}
                                                        value={currency.code}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="font-medium">{currency.code}</span>
                                                        <span className="text-muted-foreground">-</span>
                                                        <span className="text-sm text-muted-foreground">{currency.name}</span>
                                                    </SelectItem>
                                                ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </div>
                        </div>
                    </FormItem>
                )}
            />
            <Card className="p-3 bg-muted/50 border-muted">
                <div className="flex gap-2 text-xs text-muted-foreground">
                    <Info className="h-4 w-4 flex-shrink-0" />
                    <p>
                        If you received payment in cryptocurrency, use the USD value at the time of the transaction and add the details to the invoice notes.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default CurrencySelector;
