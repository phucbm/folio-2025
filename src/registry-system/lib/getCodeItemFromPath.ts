type CodeItem = {
    language: string;
    filename: string;
    code: string;
};

export async function getCodeItemFromPath({path: filePath}: { path: string }): Promise<CodeItem> {
    const {promises: fs} = await import('fs');
    const path = await import('path');

    const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), filePath);

    const filename = path.basename(absolutePath);
    const ext = path.extname(filename).replace(".", "");

    const code = await fs.readFile(absolutePath, "utf8");

    return {
        language: ext,
        filename,
        code,
    };
}