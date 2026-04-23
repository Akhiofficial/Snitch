import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


async function createProduct(req, res) {
    const { title, description, priceAmount, priceCurrency, stock } = req.body;
    const seller = req.user;
    const image = await Promise.all(req.files.map(async (file) => {
        const result = await uploadFile(file.buffer, file.originalname);
        return result.url;
    }));

    const product = await productModel.create(
        {
            title,
            description,
            price: {
                amount: Number(priceAmount),
                currency: priceCurrency || "INR",
            },
            stock: Number(stock),
            seller: seller.id,
            images: image
        });
    res.status(201).json(product);

}

async function getSellerProducts(req, res) {

    try {
        const seller = req.user;
        const products = await productModel.find({
            seller: seller.id
        })
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }

}

async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

export { createProduct, getSellerProducts, getProductById }