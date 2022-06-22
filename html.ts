// Generate html including and index containing an svg graph-diagram showing how the pages are ordered

import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import { graphviz as nodegraphviz } from 'node-graphviz';
import prettier from 'prettier';
import { createGraphGenerator } from './graphGenerator';

const prettierOptions = { parser: 'html' };

const main = async () => {
    const graphGenerator = createGraphGenerator();

    const filenames = await fs.readdir('pages');

    await Promise.all(
        filenames.map(async filename => {
            const pageNumber = parseInt(filename.slice(4));
            const pageText = await fs.readFile(`pages/${filename}`, { encoding: 'utf8' });

            const pageHtml = prettier.format(
                pageText
                    .split('\n')
                    .map(line => `<p>${line}</p>`)
                    .join(''),
                prettierOptions,
            );

            fs.writeFile(`html/page${pageNumber}.html`, pageHtml);
            graphGenerator.addSection(pageNumber, pageText);
            return true;
        }),
    );

    const svg = await nodegraphviz.layout(graphGenerator.graph.to_dot(), 'svg');

    const dom = new JSDOM(svg);

    dom.window.document.querySelectorAll('.node').forEach(nodeElement => {
        const pageNumber = nodeElement.querySelector('title')!.textContent!;
        const clickEventContent = `location.href='page${pageNumber}.html'`;
        const ellipse = nodeElement.querySelector('ellipse')!;
        const text = nodeElement.querySelector('text')!;
        ellipse.setAttribute('onclick', clickEventContent);
        text.setAttribute('onclick', clickEventContent);
    });

    fs.writeFile('html/index.html', prettier.format(dom.window.document.body.outerHTML, prettierOptions));
};

main();
