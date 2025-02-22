import { PDFDocument } from 'pdf-lib';

/**
 * Embeds an image from a data URL into a PDF document
 * @param pdfDoc The PDF document to embed the image in
 * @param dataUrl The data URL of the image
 * @returns The embedded image or null if embedding fails
 */
export async function embedImageFromDataUrl(pdfDoc: PDFDocument, dataUrl: string) {
    try {
        if (!dataUrl.startsWith('data:image/')) {
            return null;
        }

        const format = dataUrl.split(';')[0].split('/')[1];
        const base64Data = dataUrl.split(',')[1];
        const imageBytes = Buffer.from(base64Data, 'base64');

        let image;
        switch (format.toLowerCase()) {
            case 'jpeg':
            case 'jpg':
                image = await pdfDoc.embedJpg(imageBytes);
                break;
            case 'png':
                image = await pdfDoc.embedPng(imageBytes);
                break;
            default:
                console.warn(`Unsupported image format: ${format}`);
                return null;
        }

        return image;
    } catch (error) {
        console.error('Error embedding image:', error);
        return null;
    }
} 