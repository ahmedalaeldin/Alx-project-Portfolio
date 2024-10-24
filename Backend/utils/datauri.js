import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
    if (!file || !file.originalname || !file.buffer) {
        throw new Error('File must be provided with valid properties');
    }

    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString(); // Use originalname here
    return parser.format(extName, file.buffer);
};

export default getDataUri;
