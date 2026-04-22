import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
});

export async function uploadFile(fileBuffer, fileName, folder = "/snitch/products") {
    try {
        const result = await client.upload({
            file: await ImageKit.io.file(fileBuffer),
            fileName: fileName,
            folder: folder
        });
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}