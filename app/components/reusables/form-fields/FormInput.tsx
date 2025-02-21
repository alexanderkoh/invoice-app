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
import { Input, InputProps } from "@/components/ui/input";

type FormInputProps = {
    name: string;
    label?: string;
    labelHelper?: string;
    placeholder?: string;
    vertical?: boolean;
} & InputProps;

const FormInput = ({
    name,
    label,
    labelHelper,
    placeholder,
    vertical = false,
    ...props
}: FormInputProps) => {
    const { control } = useFormContext();

    const verticalInput = (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        {label && (
                            <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {`${label}`}
                            </FormLabel>
                        )}
                        {labelHelper && (
                            <span className="text-xs text-muted-foreground"> {labelHelper}</span>
                        )}
                    </div>
                    <FormControl>
                        <Input
                            {...field}
                            placeholder={placeholder}
                            className="transition-colors focus-visible:ring-1 w-full"
                            {...props}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const horizontalInput = (
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
                            {labelHelper && (
                                <span className="text-xs text-muted-foreground sm:hidden">
                                    {labelHelper}
                                </span>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="relative">
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={placeholder}
                                        className="transition-colors focus-visible:ring-1 w-full"
                                        {...props}
                                    />
                                </FormControl>
                                {labelHelper && (
                                    <span className="hidden sm:inline-block text-xs text-muted-foreground absolute -top-5 right-0">
                                        {labelHelper}
                                    </span>
                                )}
                            </div>
                            <FormMessage />
                        </div>
                    </div>
                </FormItem>
            )}
        />
    );
    return vertical ? verticalInput : horizontalInput;
};

export default FormInput;
