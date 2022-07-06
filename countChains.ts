import { createAdventureBookGraph } from './adventureBookGraph';
import Graph from 'graph-data-structure';

interface GraphVizNode {
    id: string;
}

interface GraphVizEdge {
    nodeOne: GraphVizNode;
    nodeTwo: GraphVizNode;
}

interface Chain {
    vertices: string[];
}

const main = async () => {
    const vizgraph: any = await createAdventureBookGraph();

    const graph = Graph();
    vizgraph.edges.forEach((edge: GraphVizEdge) => {
        graph.addEdge(edge.nodeOne.id, edge.nodeTwo.id);
    });

    const completeChains: Chain[] = [];

    const step = (chains: Chain[]) => {
        return chains.reduce((acc: Chain[], chain: Chain): Chain[] => {
            const node = chain.vertices[chain.vertices.length - 1];

            if (graph.adjacent(node).length === 0) {
                completeChains.push(chain);
            }

            return [
                ...acc,
                ...graph.adjacent(node).map(node => {
                    return { vertices: [...chain.vertices, node] };
                }),
            ];
        }, []);
    };

    let chains: Chain[] = [{ vertices: ['1'] }];
    while (chains.length) {
        chains = step(chains);
    }

    completeChains.forEach(chain => {
        console.log(`${chain.vertices.length} [${chain.vertices}]`);
    });
    console.log(`Total of ${completeChains.length} chains`);

    const endings = graph.nodes().filter(node => graph.adjacent(node).length === 0);
    console.log(`Endings: ${endings.length} [${endings}]`);
};

main();
