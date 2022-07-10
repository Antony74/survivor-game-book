import graphviz from 'graphviz';

const labels: [number, number, string][] = [
    [2, 6, 'fight'],
    [2, 25, 'escape'],
    [23, 14, 'escape'],
    [25, 27, 'necromancer'],
    [21, 17, 'lead'],
    [55, 47, 'worker'],
    [55, 29, 'mechanic'],
    [39, 72, 'escape'],
    [39, 62, 'guard'],
    [47, 60, 'help'],
    [47, 39, 'nothing'],
    [66, 69, 'hostess'],
];

export const createGraphGenerator = () => {
    const graph = graphviz.digraph('Survivor');

    // We implicitly turn from page 1 to 2.
    graph.addEdge('1', '2');

    const graphGenerator = {
        checkedSections: 0,
        addSection: (currentPage: number, text: string) => {
            const checked = !text.includes('(This page has not yet been checked by a native speaker)');
            const fillcolor = checked ? '#FF00FF' : '#DDDDDD';

            if (checked) {
                ++graphGenerator.checkedSections;
            }

            graph.addNode(`${currentPage}`, { style: 'filled', fillcolor });

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
                const label = labels
                    .filter(([from, to]) => currentPage === from && subsequentPage === to)
                    .map(([_from, _to, label]) => label)
                    .join();

                graph.addEdge(`${currentPage}`, `${subsequentPage}`, { label });
            });
        },
        graph,
    };

    return graphGenerator;
};
