import fs from 'fs/promises';

const main = async () => {
    const filenames = await fs.readdir('pages');

    for (const filename of filenames) {
        if (filename.split('.').length === 2) {
            let text = await fs.readFile(`pages/${filename}`, { encoding: 'utf8' });

            // Initially get rid of any capitalisations of the word 'You'
            text = text.replaceAll('You', 'you');

            let sentenceStart = true;
            for (let index = 0; index < text.length; ++index) {
                const char = text.charAt(index);

                if (sentenceStart && char >= 'a' && char <= 'z') {
                    text = text.slice(0, index) + char.toUpperCase() + text.slice(index + 1);
                }

                if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
                    sentenceStart = false;
                }

                if (char === '.' || char === '\n' || char === '!' || char === '?') {
                    sentenceStart = true;
                }
            }

            fs.writeFile(`pages/${filename}`, text);
        }
    }
};

main();
