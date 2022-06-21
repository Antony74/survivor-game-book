// Generate an svg graph-diagram showing how the pages are ordered

import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import { graphviz as nodegraphviz } from 'node-graphviz';
import { createGraphGenerator } from './graphGenerator';

const main = async () => {
    const graphGenerator = createGraphGenerator();

    const filenames = await fs.readdir('pages');

    await Promise.all(
        filenames.map(async filename => {
            const pageNumber = parseInt(filename.slice(4));
            const pageText = await fs.readFile(`pages/${filename}`, { encoding: 'utf8' });
            graphGenerator.addSection(pageNumber, pageText);
            return true;
        }),
    );

    const svg = await nodegraphviz.layout(graphGenerator.graph.to_dot(), 'svg');

    const dom = new JSDOM(svg);


//    dom.window.document.querySelector

    fs.writeFile('html/graph.html', dom.window.document.body.outerHTML);
};

main();
