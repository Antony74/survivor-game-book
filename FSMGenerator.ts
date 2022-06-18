export const createFSMGenerator = () => {
    const fsm = [
        `import { createMachine } from 'xstate';`,
        ``,
        `const fsm = createMachine({`,
        `  id: 'survivor',`,
        `  initial: '2',`,
        `  states: {`,
    ];

    const fsmGenerator = {
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

            fsm.push(`    '${currentPage}': {`);
            fsm.push(`      on: {`);

            subsequentPages.forEach(subsequentPage => {
                fsm.push(`        '${subsequentPage}': '${subsequentPage}',`);
            });

            fsm.push(`      }`);
            fsm.push(`    },`);
        },
        finish: () => {
            fsm.push(`  }`);
            fsm.push(`});`);
            return fsm.join('\n');
        },
    };

    return fsmGenerator;
};
