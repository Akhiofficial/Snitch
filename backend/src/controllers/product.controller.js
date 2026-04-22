import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


async function createProduct(req, res) {
    const { title, description, price, stock } = req.body;
    const seller = req.user;
    const image = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
            
        })
    }));

    const product = await productModel.create(
        {
            title,
            description,
            price: {
                amount: Number(price),
                currency: "INR",
            },
            stock: Number(stock),
            seller: seller.id,
            images: image

        });
    res.status(201).json(product);

}


export { createProduct }