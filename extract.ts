import fs from 'fs/promises';
import path from 'path';
const PDF2json = require('pdf2json');

const main = async () => {

    const outputDir = path.join(__dirname, 'pages');

    try {
        await fs.stat(outputDir);
    } catch (_e) {
        await fs.mkdir(outputDir);
    }

    const pdfFilename = path.join(__dirname, 'Survivor 1.0.pdf');
    const pdfParser = new PDF2json();

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        pdfData.Pages.forEach((page: any, index: number) => {
            const pageNumber = index + 1;
            const filename = `page${pageNumber}.html`;
            console.log(`Page ${pageNumber}`);

            const texts = page.Texts.map((text: any) => text.R.map((r: any) => decodeURIComponent(r.T)).join('\n'));
            texts[0] += '\n';
            fs.writeFile(path.join(__dirname, 'pages', filename), texts.join('\n'));
        });
    });

    pdfParser.loadPDF(pdfFilename);
};

main();
