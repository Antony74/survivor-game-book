import fs from 'fs/promises';
import path from 'path';
const PDF2json = require('pdf2json');

interface RObject {
    T: string;
}

interface TextObject {
    R: RObject[];
    y: number;
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

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        pdfData.Pages.forEach((page: any, pageIndex: number) => {
            const pageNumber = pageIndex + 1;
            const filename = `page${pageNumber}.txt`;
            console.log(`Page ${pageNumber}`);

            let prevY = 0;

            const texts = page.Texts.map((textObject: TextObject, textIndex: number) => {
                let text = textObject.R.map((r: RObject) => decodeURIComponent(r.T)).join(' ');

                if (textIndex && textObject.y > prevY) {
                    text = '\n' + text;
                }

                prevY = textObject.y;
                return text;
            });
            texts[0] += '\n';
            fs.writeFile(path.join(__dirname, 'pages', filename), texts.join(' '));
        });
    });

    pdfParser.loadPDF(pdfFilename);
};

main();
