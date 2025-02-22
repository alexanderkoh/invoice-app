import { PDFDocument, PDFPage } from 'pdf-lib';

// Letter size dimensions in points (8.5" x 11")
export const LETTER_WIDTH = 612;
export const LETTER_HEIGHT = 792;

// Logo constraints
export const MAX_LOGO_WIDTH = 140;
export const MAX_LOGO_HEIGHT = 100;

export interface LogoDimensions {
    width: number;
    height: number;
    reservedWidth: number;
    reservedHeight: number;
}

export function calculateLogoDimensions(logoWidth: number, logoHeight: number): LogoDimensions {
    const logoAspectRatio = logoWidth / logoHeight;
    let finalWidth = MAX_LOGO_WIDTH;
    let finalHeight = finalWidth / logoAspectRatio;
    
    if (finalHeight > MAX_LOGO_HEIGHT) {
        finalHeight = MAX_LOGO_HEIGHT;
        finalWidth = finalHeight * logoAspectRatio;
    }
    
    // Add some padding around the logo
    const padding = 20;
    
    return {
        width: finalWidth,
        height: finalHeight,
        reservedWidth: finalWidth + padding,
        reservedHeight: finalHeight + padding
    };
}

export function checkForNewPage(pdfDoc: PDFDocument, currentPage: PDFPage, yOffset: number, margin: number): { page: PDFPage, yOffset: number } {
    // If we're too close to the bottom of the page, add a new page
    if (yOffset < margin + 50) { // Leave some buffer space at bottom
        const newPage = pdfDoc.addPage([LETTER_WIDTH, LETTER_HEIGHT]); // Letter size
        return {
            page: newPage,
            yOffset: LETTER_HEIGHT - margin
        };
    }
    
    return {
        page: currentPage,
        yOffset: yOffset
    };
}

// Helper function to calculate if text will fit within width
export function getContentWidth(text: string, fontSize: number): number {
    // Approximate width calculation (average character width is roughly 0.6 times fontSize)
    return text.length * fontSize * 0.6;
}

// Helper function to ensure content fits within page width
export function fitContentToPage(text: string, maxWidth: number, fontSize: number): { text: string, fontSize: number } {
    let currentFontSize = fontSize;
    let contentWidth = getContentWidth(text, currentFontSize);
    
    // If content is too wide, reduce font size until it fits
    while (contentWidth > maxWidth && currentFontSize > 8) { // Don't go smaller than 8pt
        currentFontSize--;
        contentWidth = getContentWidth(text, currentFontSize);
    }
    
    return {
        text: text,
        fontSize: currentFontSize
    };
} 