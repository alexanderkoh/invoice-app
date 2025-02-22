import { NextRequest, NextResponse } from "next/server";
import { generateTemplate1 } from "./templates/template1";
import { generateTemplate2 } from "./templates/template2";

// Types
import { InvoiceType } from "@/types";

/**
 * Generate a PDF document of an invoice based on the provided data.
 *
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object containing the generated PDF.
 */
export async function generatePdfService(req: NextRequest) {
    try {
        const data: InvoiceType = await req.json();
        
        // Generate PDF using the selected template
        const pdfDoc = await (data.details.pdfTemplate === 2 
            ? generateTemplate2(data) 
            : generateTemplate1(data));
        
        // Generate PDF bytes
        const pdfBytes = await pdfDoc.save();
        
        return new NextResponse(pdfBytes, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="invoice.pdf"',
            },
        });
    } catch (error: any) {
        console.error("PDF Generation Error:", error);
        return new NextResponse(`Error generating PDF: ${error?.message || 'Unknown error'}`, { 
            status: 500,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
}
