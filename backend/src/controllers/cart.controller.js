import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

/**
 * @desc Add item to cart
 * @route POST /api/cart/cart
 * @access Private (User)
*/
export const addToCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const { quantity = 1 } = req.body;

        const query = { _id: productId };
        if (variantId !== 'none') {
            query["variants._id"] = variantId;
        }

        const product = await productModel.findOne(query);

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: variantId !== 'none' ? "Product or Variant not found" : "Product not found" 
            });
        }

        let price = product.price;
        let stock = product.stock;
        let effectiveVariantId = null;

        if (variantId !== 'none') {
            const variant = product.variants.find(v => v._id.toString() === variantId);
            // Use variant price only if it has an amount, otherwise fallback to product price
            price = (variant.price && variant.price.amount) ? variant.price : product.price;
            stock = variant.stock;
            effectiveVariantId = variantId;
        }

        const cart = (await cartModel.findOne({ user: req.user.id })) || 
                     (await cartModel.create({ user: req.user.id, items: [] }));

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            (effectiveVariantId ? item.variant?.toString() === effectiveVariantId : !item.variant)
        );

        if (existingItemIndex > -1) {
            const existingItem = cart.items[existingItemIndex];
            if (existingItem.quantity + quantity > stock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${stock} items left in stock. You already have ${existingItem.quantity} in cart.`
                });
            }
            existingItem.quantity += quantity;
            existingItem.price = price; // Update price in case it changed
        } else {
            if (quantity > stock) {
                return res.status(400).json({ success: false, message: `Only ${stock} items left in stock` });
            }
            cart.items.push({
                product: productId,
                variant: effectiveVariantId,
                quantity,
                price
            });
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: existingItemIndex > -1 ? "Cart updated successfully" : "Item added to cart successfully"
        });

    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route GET /api/cart
 * @desc Get user's cart
 * @access Private (User)
*/
export const getCart = async (req, res) => {

    const user = req.user;

    let cart = await cartModel.findOne({
        user: user.id
    }).populate("items.product");

    if(!cart) {
        cart = await cartModel.create({
            user: user.id
        });
    }

    return res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        cart
    });
}

/**
 * @desc Update cart item quantity
 * @route PATCH /api/cart/update/:productId/:variantId
 * @access Private (User)
 */
export const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
        }

        const cart = await cartModel.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const effectiveVariantId = variantId === 'none' ? null : variantId;
        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            (effectiveVariantId ? item.variant?.toString() === effectiveVariantId : !item.variant)
        );

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        // Check stock
        const product = await productModel.findById(productId);
        let stock = product.stock;
        if (effectiveVariantId) {
            const variant = product.variants.find(v => v._id.toString() === effectiveVariantId);
            stock = variant.stock;
        }

        if (quantity > stock) {
            return res.status(400).json({ success: false, message: `Only ${stock} items left in stock` });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        });

    } catch (error) {
        console.error("Update cart quantity error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @desc Remove item from cart
 * @route DELETE /api/cart/remove/:productId/:variantId
 * @access Private (User)
 */
export const removeFromCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const cart = await cartModel.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const effectiveVariantId = variantId === 'none' ? null : variantId;
        cart.items = cart.items.filter(item => 
            !(item.product.toString() === productId && 
              (effectiveVariantId ? item.variant?.toString() === effectiveVariantId : !item.variant))
        );

        await cart.save();

        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cart
        });

    } catch (error) {
        console.error("Remove from cart error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
