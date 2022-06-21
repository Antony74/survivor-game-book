import graphviz from 'graphviz';

export const createGraphGenerator = () => {
    const graph = graphviz.digraph('Survivor');

    for (let vertex = 1; vertex <= 77; ++vertex) {
        graph.addNode(`${vertex}`, { style: 'filled', fillcolor: '#DDDDDD' });
    }

    // We implicitly turn from page 1 to 2.
    graph.addEdge('1', '2');

    const graphGenerator = {
        addSection: (currentPage: number, text: string) => {
            text.replaceAll('\n', ' ');
            const subsequentPages = text.split(' ').reduce<number[]>((acc, word) => {
                let number = parseInt(word);

                if (number === 79) {
                    number = 68;
                }

                if (number && number !== currentPage) {
                    return [...acc, number];
                } else {
                    return acc;
                }
            }, []);

            subsequentPages.forEach(subsequentPage => {
                graph.addEdge(`${currentPage}`, `${subsequentPage}`);
            });
        },
        graph,
    };

    return graphGenerator;
};
