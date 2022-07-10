import fs from 'fs/promises';
import { Graph } from 'graphviz';
import { createGraphGenerator } from './graphGenerator';

export const createAdventureBookGraph = async (): Promise<Graph> => {
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

    console.log(
        `${graphGenerator.checkedSections} out of ${filenames.length} sections checked, leaving ${
            filenames.length - graphGenerator.checkedSections
        } still to be looked at.`,
    );

    return graphGenerator.graph;
};
