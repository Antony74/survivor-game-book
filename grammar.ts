import fs from 'fs/promises';
import fetch from 'node-fetch';

const main = async () => {
    const filenames = await fs.readdir('pages');

    for (const filename of filenames) {
        const text = await fs.readFile(`pages/${filename}`, { encoding: 'utf8' });

       const params = new URLSearchParams({text, language: 'en-GB', enabledOnly: 'false'})

        const response = await fetch('http://localhost:8081/v2/check', {
            method: 'POST',
            body: params.toString(),
        });

        if (response.status !== 200) {
            console.log(response.status)
            console.error(await response.text());
            break;
        }

        const json = await response.json();

        console.log(JSON.stringify(json, null, 2));
        break;
    }
};

main();
