import fs from 'fs/promises';

export const ensureDirExists = async (outputDir: string): Promise<void> => {
    try {
        await fs.stat(outputDir);
    } catch (_e) {
        await fs.mkdir(outputDir);
    }
}