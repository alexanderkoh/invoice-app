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
import { Textarea, TextareaProps } from "@/components/ui/textarea";

type FormTextareaProps = {
    name: string;
    label?: string;
    labelHelper?: string;
    placeholder?: string;
} & TextareaProps;

const FormTextarea = ({
    name,
    label,
    labelHelper,
    placeholder,
    ...props
}: FormTextareaProps) => {
    const { control } = useFormContext();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
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
                                    <Textarea
                                        {...field}
                                        placeholder={placeholder}
                                        className="min-h-[100px] transition-colors focus-visible:ring-1 w-full resize-y"
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
};

export default FormTextarea;
