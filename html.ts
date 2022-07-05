// Generate html including and index containing an svg graph-diagram showing how the pages are ordered

import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import prettier from 'prettier';
import { graphviz as nodegraphviz } from 'node-graphviz';
import path from 'path';
import { createAdventureBookGraph } from './adventureBookGraph';
import { ensureDirExists } from './ensureDirExists';

const prettierOptions = { parser: 'html' };

const main = async () => {
    const outputDir = path.join(__dirname, 'html');
    await ensureDirExists(outputDir);

    const graphPromise = createAdventureBookGraph();

    const filenames = await fs.readdir('pages');

    await Promise.all(
        filenames.map(async filename => {
            const pageNumber = parseInt(filename.slice(4));
            const pageText = await fs.readFile(`pages/${filename}`, { encoding: 'utf8' });

            const pageHtml = prettier.format(
                pageText
                    .split('\n')
                    .map(line => {
                        const annotatedLine = line
                            .split(' ')
                            .map(word => {
                                let number = parseInt(word);
                                return number ? `<a href="page${number}.html">${word}</a>` : word;
                            })
                            .join(' ');

                        return `<p>${annotatedLine}</p>`;
                    })
                    .join('\n'),
                prettierOptions,
            );

            fs.writeFile(`html/page${pageNumber}.html`, pageHtml);
            return true;
        }),
    );

    const graph = await graphPromise;

    const svg = await nodegraphviz.layout(graph.to_dot(), 'svg');

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
