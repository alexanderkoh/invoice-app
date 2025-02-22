"use client";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Form } from "@/components/ui/form";

// Components
import { InvoiceActions, InvoiceForm } from "@/app/components";

// Context
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// Types
import { InvoiceType } from "@/types";

const InvoiceMain = () => {
    const { handleSubmit } = useFormContext<InvoiceType>();

    // Get the needed values from invoice context
    const { onFormSubmit } = useInvoiceContext();

    return (
        <Form {...useFormContext<InvoiceType>()}>
            <form
                onSubmit={handleSubmit(onFormSubmit, (err) => {
                    console.log(err);
                })}
                className="container mx-auto py-6 sm:py-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-11 gap-6">
                    <div className="lg:col-span-5 xl:col-span-5">
                        <div className="sticky top-[5.5rem]">
                            <InvoiceForm />
                        </div>
                    </div>
                    <div className="lg:col-span-7 xl:col-span-6">
                        <div className="sticky top-[5.5rem]">
                            <InvoiceActions />
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default InvoiceMain;
