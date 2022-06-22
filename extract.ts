// Extract the pages from the pdf file

import fs from 'fs/promises';
import path from 'path';

const PDF2json = require('pdf2json');

interface RObject {
    T: string;
}

interface TextObject {
    R: RObject[];
    x: number;
    y: number;
}

interface Page {
    Texts: TextObject[];
}

interface PDFData {
    Pages: Page[];
}

const main = async () => {
    const outputDir = path.join(__dirname, 'pages');

    try {
        await fs.stat(outputDir);
    } catch (_e) {
        await fs.mkdir(outputDir);
    }

    const pdfFilename = path.join(__dirname, 'Survivor 1.0.pdf');
    const pdfParser = new PDF2json();

    pdfParser.on('pdfParser_dataReady', async (pdfData: PDFData) => {
        pdfData.Pages.forEach((page: Page, pageIndex: number) => {
            const pageNumber = pageIndex + 1;
            const filename = `page${pageNumber}.txt`;
            console.log(`Page ${pageNumber}`);

            let prevY = 0;

            const texts = page.Texts.map((textObject: TextObject, textIndex: number) => {
                let text = textObject.R.map((r: RObject) => decodeURIComponent(r.T)).join(' ');
                const { x, y } = textObject;

                const gap = y - prevY;

                if (textIndex) {
                    if (gap > 1 || (gap > 0 && x > 4)) {
                        text = '\n' + text;
                    }
                }

                prevY = y;
                return text;
            });
            texts[0] += '\n';

            let pageText = texts.join(' ');
            pageText = pageText.replaceAll('  ', ' ');
            pageText = pageText.replaceAll(' !', '!');

            fs.writeFile(path.join(__dirname, 'pages', filename), pageText);
        });
    });

    pdfParser.loadPDF(pdfFilename);
};

main();
