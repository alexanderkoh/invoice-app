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
        // Initialize chromium
        await chromium.font('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
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
                '--no-first-run',
                '--disable-extensions',
                '--disable-audio-output',
                '--memory-pressure-off',
                '--disable-default-apps',
                '--js-flags="--max-old-space-size=512"'
            ],
            defaultViewport: {
                width: 1200,
                height: 1800,
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
        
        // Set low memory limits
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
                request.continue();
            } else {
                request.abort();
            }
        });

        // Generate HTML content
        const ReactDOMServer = (await import("react-dom/server")).default;
        const InvoiceTemplate = await getInvoiceTemplate(body.details.pdfTemplate);
        
        if (!InvoiceTemplate) {
            throw new Error('Failed to load invoice template');
        }

        const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
            InvoiceTemplate(body)
        );

        await page.setContent(htmlTemplate, {
            waitUntil: ["load", "networkidle0"],
            timeout: 10000 // 10 second timeout
        });

        await page.addStyleTag({
            url: TAILWIND_CDN
        });

        // Small delay using setTimeout instead of waitForTimeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pdf = await page.pdf({
            format: "a4",
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
        });

        await browser.close();

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
        
        return new NextResponse(`Error generating PDF: ${error?.message || 'Unknown error'}`, { 
            status: 500,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
}
