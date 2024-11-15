'use client'
import InvoicePDF from "@/components/pdf/InvoicePDF";
import { renderToStream } from "@react-pdf/renderer";



/**
 * Genera un archivo PDF con las órdenes.
 * @param {Array} orders - Lista de órdenes.
 * @param {string} logoPath - Ruta del logo de la empresa.
 * @returns {Promise<Buffer>} Contenido del archivo PDF.
 */
export const generatePDF = async (orders, logoPath) => {
    const pdfStream = await renderToStream(<InvoicePDF orders={orders} logoPath={logoPath} />);
    const buffers = [];

    return new Promise((resolve, reject) => {
        pdfStream.on('data', buffers.push.bind(buffers));
        pdfStream.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        pdfStream.on('error', reject);
    });
};