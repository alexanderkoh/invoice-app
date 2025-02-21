"use client";

// ShadCn
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Components
import {
    PdfViewer,
    BaseButton,
    NewInvoiceAlert,
    InvoiceLoaderModal,
    InvoiceExportModal,
} from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// Icons
import { FileInput, FolderUp, Import, Plus } from "lucide-react";

const InvoiceActions = () => {
    const { invoicePdfLoading } = useInvoiceContext();

    return (
        <div className="h-full flex flex-col">
            <Card className="flex-1">
                <CardHeader className="pb-4">
                    <CardTitle className="uppercase">ACTIONS</CardTitle>
                    <CardDescription>Operations and preview</CardDescription>
                </CardHeader>

                <div className="flex flex-col gap-4 p-4">
                    <div className="grid grid-cols-2 gap-3">
                        <InvoiceLoaderModal>
                            <BaseButton
                                variant="outline"
                                tooltipLabel="Open load invoice menu"
                                disabled={invoicePdfLoading}
                                className="w-full"
                            >
                                <FolderUp className="w-4 h-4 mr-2" />
                                <span>Load Invoice</span>
                            </BaseButton>
                        </InvoiceLoaderModal>

                        <InvoiceExportModal>
                            <BaseButton
                                variant="outline"
                                tooltipLabel="Open load invoice menu"
                                disabled={invoicePdfLoading}
                                className="w-full"
                            >
                                <Import className="w-4 h-4 mr-2" />
                                <span>Export Invoice</span>
                            </BaseButton>
                        </InvoiceExportModal>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <NewInvoiceAlert>
                            <BaseButton
                                variant="outline"
                                tooltipLabel="Get a new invoice form"
                                disabled={invoicePdfLoading}
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                <span>New Invoice</span>
                            </BaseButton>
                        </NewInvoiceAlert>

                        <BaseButton
                            type="submit"
                            tooltipLabel="Generate your invoice"
                            loading={invoicePdfLoading}
                            loadingText="Generating..."
                            className="w-full"
                        >
                            <FileInput className="w-4 h-4 mr-2" />
                            <span>Generate PDF</span>
                        </BaseButton>
                    </div>

                    <div className="flex-1 min-h-[calc(100vh-20rem)] lg:min-h-[calc(100vh-15rem)]">
                        <PdfViewer />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default InvoiceActions;
