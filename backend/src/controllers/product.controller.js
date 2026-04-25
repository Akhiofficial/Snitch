import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


async function createProduct(req, res) {
    const { title, description, priceAmount, priceCurrency, stock, sizes } = req.body;
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
            sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split(',').map(s => s.trim())) : [],
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

async function getAllProducts(req, res) {
    try {
        const products = await productModel.find();
        
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products    
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

// ─── Variant Controllers ──────────────────────────────────────────────────────

async function addVariant(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;

        const product = await productModel.findOne({ _id: id, seller: seller.id });
        if (!product) {
            return res.status(404).json({ message: "Product not found or access denied", success: false });
        }

        // Handle attributes. Convert to plain object to avoid 'Cast to Map failed' for null-prototype objects.
        const attributes = req.body.attributes ? JSON.parse(JSON.stringify(req.body.attributes)) : {};
        
        if (Object.keys(attributes).length === 0) {
            return res.status(400).json({ message: "At least one attribute is required", success: false });
        }

        // Upload variant images (optional)
        const variantImages = [];
        if (req.files && req.files.length > 0) {
            const uploadResults = await Promise.all(
                req.files.map(async (file) => {
                    const result = await uploadFile(file.buffer, file.originalname, "/snitch/variants");
                    return { url: result.url };
                })
            );
            variantImages.push(...uploadResults);
        }

        const variantData = {
            attributes,
            stock: Number(req.body.stock) || 0,
            images: variantImages
        };

        // Price is optional, only set if amount is provided and valid
        if (req.body.priceAmount && !isNaN(Number(req.body.priceAmount)) && Number(req.body.priceAmount) > 0) {
            variantData.price = {
                amount: Number(req.body.priceAmount),
                currency: req.body.priceCurrency || "INR"
            };
        }

        product.variants.push(variantData);
        await product.save();

        res.status(201).json({
            message: "Variant added successfully",
            success: true,
            variant: product.variants[product.variants.length - 1],
            product
        });

    } catch (error) {
        console.error("Add Variant Error:", error);
        res.status(500).json({ message: error.message, success: false });
    }
}

async function updateVariantStock(req, res) {
    try {
        const { id, vid } = req.params;
        const seller = req.user;
        const { stock } = req.body;

        const product = await productModel.findOne({ _id: id, seller: seller.id });
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        const variant = product.variants.id(vid);
        if (!variant) {
            return res.status(404).json({ message: "Variant not found", success: false });
        }

        variant.stock = Number(stock);
        await product.save();

        res.status(200).json({ message: "Stock updated", success: true, variant });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

async function deleteVariant(req, res) {
    try {
        const { id, vid } = req.params;
        const seller = req.user;

        const product = await productModel.findOne({ _id: id, seller: seller.id });
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        product.variants.pull(vid);
        await product.save();

        res.status(200).json({ message: "Variant removed", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;
        const { title, description, priceAmount, priceCurrency, stock, sizes } = req.body;

        const product = await productModel.findOne({ _id: id, seller: seller.id });
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        if (title) product.title = title;
        if (description) product.description = description;
        if (priceAmount) product.price.amount = Number(priceAmount);
        if (priceCurrency) product.price.currency = priceCurrency;
        if (stock !== undefined) product.stock = Number(stock);
        if (sizes) {
            product.sizes = Array.isArray(sizes) ? sizes : sizes.split(',').map(s => s.trim());
        }

        if (req.files && req.files.length > 0) {
            const newImages = await Promise.all(req.files.map(async (file) => {
                const result = await uploadFile(file.buffer, file.originalname);
                return result.url;
            }));
            // Replace images if provided
            product.images = newImages;
        }

        await product.save();
        res.status(200).json({ message: "Product updated successfully", success: true, product });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;

        const product = await productModel.findOneAndDelete({ _id: id, seller: seller.id });
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        res.status(200).json({ message: "Product withdrawn successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

async function updateVariant(req, res) {
    try {
        const { id, vid } = req.params;
        const seller = req.user;
        const { stock, priceAmount, priceCurrency } = req.body;
        
        const product = await productModel.findOne({ _id: id, seller: seller.id });
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        const variant = product.variants.id(vid);
        if (!variant) {
            return res.status(404).json({ message: "Variant not found", success: false });
        }

        if (stock !== undefined) variant.stock = Number(stock);
        
        if (priceAmount && !isNaN(Number(priceAmount))) {
            variant.price = {
                amount: Number(priceAmount),
                currency: priceCurrency || "INR"
            };
        }

        // Attributes
        if (req.body.attributes) {
            // Attributes are usually passed as attributes[Color]=Red
            // If they are passed as a JSON string, we parse them
            const attributes = typeof req.body.attributes === 'string' 
                ? JSON.parse(req.body.attributes) 
                : JSON.parse(JSON.stringify(req.body.attributes));
            variant.attributes = attributes;
        }

        // Images
        if (req.files && req.files.length > 0) {
            const newImages = await Promise.all(
                req.files.map(async (file) => {
                    const result = await uploadFile(file.buffer, file.originalname, "/snitch/variants");
                    return { url: result.url };
                })
            );
            variant.images = newImages;
        }

        await product.save();
        res.status(200).json({ message: "Variant updated successfully", success: true, variant });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

export { createProduct, getSellerProducts, getProductById, getAllProducts, addVariant, updateVariantStock, deleteVariant, updateProduct, deleteProduct, updateVariant }
