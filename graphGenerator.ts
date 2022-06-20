import graphviz from 'graphviz';

export const createGraphGenerator = () => {

    const graph = graphviz.digraph('Survivor');

    const graphGenerator = {
        addSection: (currentPage: number, text: string) => {
            text.replaceAll('\n', ' ');
            const subsequentPages = text.split(' ').reduce<number[]>((acc, word) => {
                let number = parseInt(word);

                if (number === 79) {number = 68}

                if (number && number !== currentPage) {
                    return [...acc, number];
                } else {
                    return acc;
                }
            }, []);

            subsequentPages.forEach(subsequentPage => {
                graph.addEdge(`${currentPage}`, `${subsequentPage}`)
            });
        },
        graph
    };

    return graphGenerator;
};
