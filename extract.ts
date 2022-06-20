import fs from 'fs/promises';
import path from 'path';
import { createGraphGenerator } from './graphGenerator';
import { graphviz as nodegraphviz } from 'node-graphviz';

const PDF2json = require('pdf2json');

interface RObject {
    T: string;
}

interface TextObject {
    R: RObject[];
    y: number;
}

interface Page {
    Texts: TextObject[];
}

interface PDFData {
    Pages: Page[];
}

const main = async () => {
    const fsmGenerator = createGraphGenerator();

    const outputDir = path.join(__dirname, 'pages');

    try {
        await fs.stat(outputDir);
    } catch (_e) {
        await fs.mkdir(outputDir);
    }

    const pdfFilename = path.join(__dirname, 'Survivor 1.0.pdf');
    const pdfParser = new PDF2json();

    const fsmFilename = path.join(__dirname, 'fsm.ts');

    pdfParser.on('pdfParser_dataReady', async (pdfData: PDFData) => {
        pdfData.Pages.forEach((page: Page, pageIndex: number) => {
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

            let pageText = texts.join(' ');
            pageText = pageText.replaceAll('  ', ' ');
            pageText = pageText.replaceAll(' !', '!');

            fs.writeFile(path.join(__dirname, 'pages', filename), pageText);
            fsmGenerator.addSection(pageNumber, pageText);
        });

        const svg = await nodegraphviz.layout(fsmGenerator.graph.to_dot(), 'svg');
        fs.writeFile('graph.svg', svg);
    });

    pdfParser.loadPDF(pdfFilename);
};

main();
