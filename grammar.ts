import fs from 'fs/promises';
import fetch from 'node-fetch';

interface Replacement {
    value: string;
}

interface Rule {
    id: string;
}

interface Match {
    replacements: Replacement[];
    offset: number;
    length: number;
    rule: Rule;
}

interface Grammar {
    matches: Match[];
}

const main = async () => {
    const filenames = await fs.readdir('pages');

    for (const filename of filenames) {
        if (filename.split('.').length === 2) {
            let text = await fs.readFile(`pages/${filename}`, { encoding: 'utf8' });

            // Get rid of any capitalisations of the word 'You', trusting the
            // UPPERCASE_SENTENCE_START rule to restore any needed.
            text = text.replaceAll('You', 'you');

            const params = new URLSearchParams({ text, language: 'en-GB', enabledOnly: 'false' });

            const response = await fetch('http://localhost:8081/v2/check', {
                method: 'POST',
                body: params.toString(),
            });

            if (response.status !== 200) {
                console.log(response.status);
                console.error(await response.text());
                break;
            }

            const grammar: Grammar = await response.json();
            grammar.matches.reverse();

            grammar.matches.forEach(match => {
                if (match.replacements.length === 1) {
                    if (match.rule.id === 'UPPERCASE_SENTENCE_START') {
                        text =
                            text.slice(0, match.offset) +
                            match.replacements[0].value +
                            text.slice(match.offset + match.length);
                    }
                }
            });

            fs.writeFile(`pages/${filename}`, text);
            fs.writeFile(`pages/${filename}.json`, JSON.stringify(grammar, null, 2));
        }
    }
};

main();
