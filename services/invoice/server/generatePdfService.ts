import { NextRequest, NextResponse } from "next/server";

// Chromium
import chromium from "@sparticuz/chromium";

// Helpers
import { getInvoiceTemplate } from "@/lib/helpers";

// Variables
import { CHROMIUM_EXECUTABLE_PATH, ENV, TAILWIND_CDN } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

/**
 * Generate a PDF document of an invoice based on the provided data.
 *
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @throws {Error} If there is an error during the PDF generation process.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object containing the generated PDF.
 */
export async function generatePdfService(req: NextRequest) {
    const body = await req.json();
    let browser;

    try {
        const puppeteer = await import("puppeteer-core");
        
        browser = await puppeteer.launch({
            args: [
                ...chromium.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: true,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        
        // Your existing PDF generation code...
        const ReactDOMServer = (await import("react-dom/server")).default;
        const InvoiceTemplate = await getInvoiceTemplate(body.details.pdfTemplate);
        const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
            InvoiceTemplate(body)
        );

        await page.setContent(htmlTemplate, {
            waitUntil: "networkidle0",
        });

        await page.addStyleTag({
            url: "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
        });

        const pdf = await page.pdf({
            format: "a4",
            printBackground: true,
        });

        await browser.close();

        return new NextResponse(pdf, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="invoice.pdf"',
            },
        });
    } catch (error) {
        if (browser) {
            await browser.close();
        }
        console.error("PDF Generation Error:", error);
        return new NextResponse(`Error generating PDF: ${error}`, { status: 500 });
    }
}
