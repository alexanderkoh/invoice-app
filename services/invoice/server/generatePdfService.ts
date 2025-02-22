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
        // Initialize chromium with minimal memory usage
        const puppeteer = await import("puppeteer-core");
        
        browser = await puppeteer.launch({
            args: [
                ...chromium.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--single-process',
                '--no-zygote',
                '--font-render-hinting=none',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--js-flags="--max-old-space-size=450"' // Keep Node heap size well under the 1024MB limit
            ],
            defaultViewport: {
                width: 800, // Reduced from 1200
                height: 1200, // Reduced from 1800
                deviceScaleFactor: 1,
                isMobile: false,
                hasTouch: false,
                isLandscape: false
            },
            executablePath: await chromium.executablePath(),
            headless: true,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        
        // Aggressive memory optimization
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            if (resourceType === 'stylesheet' || (resourceType === 'font' && request.url().includes('fonts.googleapis.com'))) {
                request.continue();
            } else {
                request.abort();
            }
        });

        // Clean up memory after each navigation
        page.on('load', () => {
            if (global.gc) global.gc();
        });

        // Generate HTML content with minimal ReactDOMServer
        const ReactDOMServer = (await import("react-dom/server")).default;
        const InvoiceTemplate = await getInvoiceTemplate(body.details.pdfTemplate);
        
        if (!InvoiceTemplate) {
            throw new Error('Failed to load invoice template');
        }

        const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
            InvoiceTemplate(body)
        );

        // Set content with minimal wait time
        await page.setContent(htmlTemplate, {
            waitUntil: "networkidle0",
            timeout: 5000 // Reduced timeout
        });

        await page.addStyleTag({
            url: TAILWIND_CDN
        });

        // Minimal delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const pdf = await page.pdf({
            format: "a4",
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
            scale: 0.8 // Slightly reduce scale to ensure content fits
        });

        await browser.close();

        // Force garbage collection if available
        if (global.gc) global.gc();

        return new NextResponse(pdf, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="invoice.pdf"',
            },
        });
    } catch (error: any) {
        console.error("PDF Generation Error Details:", {
            error: error?.message || 'Unknown error',
            stack: error?.stack,
            memory: process.memoryUsage()
        });
        
        if (browser) {
            await browser.close();
        }
        
        // Force garbage collection if available
        if (global.gc) global.gc();
        
        return new NextResponse(`Error generating PDF: ${error?.message || 'Unknown error'}`, { 
            status: 500,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
}
