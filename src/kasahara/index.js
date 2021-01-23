import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as fetch from 'node-fetch';
import * as fs from 'fs';
// const fetch = require('node-fetch');
// const fs = require('fs');

/**
 * pdfを1枚にくっつけるやつ
 */
const mergePages = async () => {
    const url1 = 'sample/sample1.pdf';
    const url2 = 'sample/sample2.pdf';
    // Load cover and content pdfs
    const cover = await PDFDocument.load(fs.readFileSync(url1));
    const content = await PDFDocument.load(fs.readFileSync(url2));

    // Create a new document
    const doc = await PDFDocument.create();

    // Add the cover to the new doc
    const [coverPage] = await doc.copyPages(cover, [0]);
    doc.addPage(coverPage);

    // Add individual content pages
    const contentPages = await doc.copyPages(content, content.getPageIndices());
    for (const page of contentPages) {
        doc.addPage(page);
    }

    // Write the PDF to a file
    fs.writeFileSync('./test.pdf', await doc.save());
}

mergePages();