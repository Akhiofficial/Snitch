import productModel from "../models/product.model.js";



export const stockOfVariant = async (productId, variantId) => {
    const product = await productModel.findById(productId);
    if (!product) return 0;

    if (variantId === 'none') {
        return product.stock || 0;
    }

    const variant = product.variants.find(
        v => v._id.toString() === variantId
    );

    return variant ? variant.stock : 0;
}