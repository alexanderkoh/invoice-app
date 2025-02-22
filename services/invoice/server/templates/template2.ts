import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Types
import { InvoiceType } from "@/types";

// Helpers
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";
import { embedImageFromDataUrl } from './imageHelper';
import { 
    checkForNewPage, 
    fitContentToPage, 
    LETTER_WIDTH, 
    LETTER_HEIGHT,
    calculateLogoDimensions 
} from './pageHelper';

export async function generateTemplate2(data: InvoiceType) {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([LETTER_WIDTH, LETTER_HEIGHT]);
    
    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Constants for layout
    const margin = 50;
    const lineHeight = 15;
    const contentWidth = LETTER_WIDTH - (margin * 2);
    let yOffset = LETTER_HEIGHT - margin;
    
    // Calculate logo dimensions and space if logo exists
    let logoSpace = { width: 0, height: 0, reservedWidth: 0, reservedHeight: 0 };
    if (data.details.invoiceLogo) {
        const logo = await embedImageFromDataUrl(pdfDoc, data.details.invoiceLogo);
        if (logo) {
            logoSpace = calculateLogoDimensions(logo.width, logo.height);
            
            // Draw the logo (positioned on the right)
            page.drawImage(logo, {
                x: LETTER_WIDTH - margin - logoSpace.width,
                y: LETTER_HEIGHT - margin - logoSpace.height,
                width: logoSpace.width,
                height: logoSpace.height,
            });
        }
    }
    
    // Draw invoice header (positioned on the left)
    const invoiceText = 'Invoice #';
    const { text: invoiceHeaderText, fontSize: invoiceHeaderSize } = fitContentToPage(
        invoiceText,
        contentWidth / 3,
        24
    );
    
    page.drawText(invoiceHeaderText, {
        x: margin,
        y: LETTER_HEIGHT - margin,
        size: invoiceHeaderSize,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3),
    });
    
    yOffset = LETTER_HEIGHT - margin - 25;
    page.drawText(data.details.invoiceNumber, {
        x: margin,
        y: yOffset,
        size: 12,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
    });
    
    // Draw sender name in blue (positioned below invoice number)
    const senderNameY = LETTER_HEIGHT - margin - 60;
    const { text: senderName, fontSize: senderFontSize } = fitContentToPage(
        data.sender.name,
        contentWidth / 2,
        18
    );
    
    page.drawText(senderName, {
        x: margin,
        y: senderNameY,
        size: senderFontSize,
        font: boldFont,
        color: rgb(0, 0.53, 0.71),
    });
    
    // Draw sender address on the right (positioned to not overlap with logo)
    let rightSideY = LETTER_HEIGHT - margin - (logoSpace.height > 0 ? logoSpace.reservedHeight : 0) - 25;
    const addressLines = [
        data.sender.address,
        `${data.sender.zipCode}, ${data.sender.city}`,
        data.sender.country,
    ];
    
    addressLines.forEach(line => {
        const lineWidth = font.widthOfTextAtSize(line, 12);
        const xPosition = Math.min(
            LETTER_WIDTH - margin - lineWidth,
            LETTER_WIDTH - margin - (logoSpace.width > 0 ? logoSpace.reservedWidth : 0)
        );
        
        page.drawText(line, {
            x: xPosition,
            y: rightSideY,
            size: 12,
            font: font,
            color: rgb(0.3, 0.3, 0.3),
        });
        rightSideY -= lineHeight;
    });
    
    // Start content after header section and logo
    const headerHeight = Math.max(150, logoSpace.reservedHeight + 50);
    yOffset = LETTER_HEIGHT - margin - headerHeight;
    
    // Draw billing information
    yOffset -= lineHeight * 2;
    page.drawText('Bill to:', {
        x: margin,
        y: yOffset,
        size: 14,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3),
    });
    
    yOffset -= lineHeight * 1.5;
    page.drawText(data.receiver.name, {
        x: margin,
        y: yOffset,
        size: 14,
        font: boldFont,
    });
    
    yOffset -= lineHeight;
    [
        data.receiver.address,
        `${data.receiver.city}, ${data.receiver.country}`,
    ].forEach(line => {
        page.drawText(line, {
            x: margin,
            y: yOffset,
            size: 12,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
        });
        yOffset -= lineHeight;
    });
    
    // Draw dates on the right
    let datesY = yOffset + lineHeight * 4;
    const dateLabels = [
        { label: 'Invoice date:', value: data.details.invoiceDate },
        { label: 'Due date:', value: data.details.dueDate },
    ];
    
    dateLabels.forEach(({ label, value }) => {
        page.drawText(label, {
            x: LETTER_WIDTH - margin - 200,
            y: datesY,
            size: 12,
            font: boldFont,
        });
        
        page.drawText(value, {
            x: LETTER_WIDTH - margin - 100,
            y: datesY,
            size: 12,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
        });
        
        datesY -= lineHeight;
    });
    
    // Draw items table
    yOffset -= lineHeight * 4;
    const tableTop = yOffset;
    const cols = {
        item: margin,
        qty: margin + Math.floor(contentWidth * 0.5),  // 50% for item description
        rate: margin + Math.floor(contentWidth * 0.65), // 15% for quantity
        amount: margin + Math.floor(contentWidth * 0.8), // 15% for rate, 20% for amount
    };
    
    // Table headers
    ['Item', 'Qty', 'Rate', 'Amount'].forEach((header, index) => {
        const x = Object.values(cols)[index];
        page.drawText(header, {
            x,
            y: tableTop,
            size: 12,
            font: boldFont,
            color: rgb(0.5, 0.5, 0.5),
        });
    });
    
    // Draw horizontal line under headers
    page.drawLine({
        start: { x: margin, y: tableTop - lineHeight / 2 },
        end: { x: LETTER_WIDTH - margin, y: tableTop - lineHeight / 2 },
        thickness: 0.5,
        color: rgb(0.9, 0.9, 0.9),
    });
    
    // Table rows
    yOffset = tableTop - lineHeight * 1.5;
    for (const item of data.details.items) {
        // Check if we need a new page
        ({ page, yOffset } = checkForNewPage(pdfDoc, page, yOffset, margin));
        
        // Fit item name to available width
        const itemWidth = cols.qty - cols.item - 10;
        const { text: itemName, fontSize: itemFontSize } = fitContentToPage(
            item.name,
            itemWidth,
            12
        );
        
        page.drawText(itemName, {
            x: cols.item,
            y: yOffset,
            size: itemFontSize,
            font: font,
        });
        
        if (item.description) {
            yOffset -= lineHeight;
            ({ page, yOffset } = checkForNewPage(pdfDoc, page, yOffset, margin));
            
            const { text: description, fontSize: descFontSize } = fitContentToPage(
                item.description,
                itemWidth,
                10
            );
            
            page.drawText(description, {
                x: cols.item,
                y: yOffset,
                size: descFontSize,
                font: font,
                color: rgb(0.5, 0.5, 0.5),
            });
        }
        
        const qtyText = item.quantity.toString();
        const rateText = formatNumberWithCommas(item.unitPrice);
        const totalText = formatNumberWithCommas(item.total);
        
        page.drawText(qtyText, {
            x: cols.qty,
            y: yOffset,
            size: 12,
            font: font,
        });
        
        page.drawText(rateText, {
            x: cols.rate,
            y: yOffset,
            size: 12,
            font: font,
        });
        
        page.drawText(totalText, {
            x: cols.amount + (100 - font.widthOfTextAtSize(totalText, 12)),
            y: yOffset,
            size: 12,
            font: font,
        });
        
        yOffset -= lineHeight * 1.5;
        
        // Draw line under each row
        page.drawLine({
            start: { x: margin, y: yOffset + lineHeight / 2 },
            end: { x: LETTER_WIDTH - margin, y: yOffset + lineHeight / 2 },
            thickness: 0.5,
            color: rgb(0.9, 0.9, 0.9),
        });
    }
    
    // Draw totals
    yOffset -= lineHeight * 2;
    ({ page, yOffset } = checkForNewPage(pdfDoc, page, yOffset, margin));
    
    const totalsSection = [
        { label: 'Subtotal:', value: formatNumberWithCommas(Number(data.details.subTotal)) },
        ...(data.details.discountDetails?.amount ? [{
            label: 'Discount:',
            value: data.details.discountDetails.amountType === 'percentage'
                ? `${data.details.discountDetails.amount}%`
                : formatNumberWithCommas(data.details.discountDetails.amount)
        }] : []),
        ...(data.details.taxDetails?.amount ? [{
            label: 'Tax:',
            value: data.details.taxDetails.amountType === 'percentage'
                ? `${data.details.taxDetails.amount}%`
                : formatNumberWithCommas(data.details.taxDetails.amount)
        }] : []),
        ...(data.details.shippingDetails?.cost ? [{
            label: 'Shipping:',
            value: data.details.shippingDetails.costType === 'percentage'
                ? `${data.details.shippingDetails.cost}%`
                : formatNumberWithCommas(data.details.shippingDetails.cost)
        }] : []),
        { label: 'Total:', value: `${formatNumberWithCommas(Number(data.details.totalAmount))} ${data.details.currency}` }
    ];
    
    totalsSection.forEach(({ label, value }) => {
        ({ page, yOffset } = checkForNewPage(pdfDoc, page, yOffset, margin));
        
        page.drawText(label, {
            x: cols.rate,
            y: yOffset,
            size: 12,
            font: boldFont,
        });
        
        page.drawText(value, {
            x: cols.amount + (100 - font.widthOfTextAtSize(value, 12)),
            y: yOffset,
            size: 12,
            font: font,
        });
        
        yOffset -= lineHeight;
    });
    
    // Draw payment information
    if (data.details.paymentInformation) {
        yOffset -= lineHeight * 2;
        ({ page, yOffset } = checkForNewPage(pdfDoc, page, yOffset, margin));
        
        page.drawText('Payment Information:', {
            x: margin,
            y: yOffset,
            size: 14,
            font: boldFont,
            color: rgb(0, 0.53, 0.71),
        });
        
        yOffset -= lineHeight;
        if (data.details.paymentInformation.paymentType === 'bankTransfer') {
            [
                ['Bank:', data.details.paymentInformation.bankName],
                ['Account Name:', data.details.paymentInformation.accountName],
                ['Account Number:', data.details.paymentInformation.accountNumber],
            ].forEach(([label, value]) => {
                ({ page, yOffset } = checkForNewPage(pdfDoc, page, yOffset, margin));
                
                page.drawText(label, {
                    x: margin,
                    y: yOffset,
                    size: 12,
                    font: boldFont,
                });
                
                page.drawText(value as string, {
                    x: margin + 120,
                    y: yOffset,
                    size: 12,
                    font: font,
                });
                
                yOffset -= lineHeight;
            });
        } else {
            [
                ['Network:', 'Stellar'],
                ['Public Key:', data.details.paymentInformation.publicKey],
                ...(data.details.paymentInformation.memo ? [['Memo:', data.details.paymentInformation.memo]] : []),
                ['Currency:', data.details.paymentInformation.currency],
            ].forEach(([label, value]) => {
                ({ page, yOffset } = checkForNewPage(pdfDoc, page, yOffset, margin));
                
                page.drawText(label, {
                    x: margin,
                    y: yOffset,
                    size: 12,
                    font: boldFont,
                });
                
                page.drawText(value, {
                    x: margin + 120,
                    y: yOffset,
                    size: 12,
                    font: font,
                });
                
                yOffset -= lineHeight;
            });
        }
    }
    
    // Draw footer
    yOffset -= lineHeight * 2;
    ({ page, yOffset } = checkForNewPage(pdfDoc, page, yOffset, margin));
    
    page.drawText('Contact Information:', {
        x: margin,
        y: yOffset,
        size: 12,
        font: boldFont,
    });
    
    yOffset -= lineHeight;
    [data.sender.email, data.sender.phone].forEach(info => {
        ({ page, yOffset } = checkForNewPage(pdfDoc, page, yOffset, margin));
        
        page.drawText(info, {
            x: margin,
            y: yOffset,
            size: 12,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
        });
        yOffset -= lineHeight;
    });
    
    // Draw signature if exists
    if (data.details.signature?.data) {
        yOffset -= lineHeight * 2;
        ({ page, yOffset } = checkForNewPage(pdfDoc, page, yOffset, margin));
        
        page.drawText('Signature:', {
            x: margin,
            y: yOffset,
            size: 12,
            font: boldFont,
        });
        
        yOffset -= lineHeight;
        
        if (isDataUrl(data.details.signature.data)) {
            const signatureImage = await embedImageFromDataUrl(pdfDoc, data.details.signature.data);
            if (signatureImage) {
                const signatureWidth = 120;
                const signatureHeight = (signatureImage.height / signatureImage.width) * signatureWidth;
                
                // Check if signature will fit on current page
                if (yOffset - signatureHeight < margin + 20) {
                    page = pdfDoc.addPage([LETTER_WIDTH, LETTER_HEIGHT]);
                    yOffset = LETTER_HEIGHT - margin;
                }
                
                page.drawImage(signatureImage, {
                    x: margin,
                    y: yOffset - signatureHeight,
                    width: signatureWidth,
                    height: signatureHeight,
                });
            }
        } else {
            // For text-based signatures
            page.drawText(data.details.signature.data, {
                x: margin,
                y: yOffset,
                size: 24,
                font: font,
            });
        }
    }
    
    return pdfDoc;
} 