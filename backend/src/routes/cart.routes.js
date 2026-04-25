import express from "express";
import { authenticateUser } from "../middlewear/auth.middlewear.js";
import { addToCart, getCart, updateCartItemQuantity, removeFromCart } from "../controllers/cart.controller.js";
import { validateAddToCart } from "../validators/cart.validator.js";


const router = express.Router();

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private (User)
 * @arguments productId - ID of the product to add to the cart
 * @arguments variantId - ID of the variant to add to the cart
 * @arguments quantity - Quantity of the product to add to the cart
 * @returns {Object} - The added item to the cart
*/
router.post('/add/:productId/:variantId', validateAddToCart, authenticateUser, addToCart)

/**
 * @route GET /api/cart
 * @desc Get user's cart
 * @access Private (User)
 * @returns {Object} - The user's cart
*/
router.get('/', authenticateUser, getCart)

/**
 * @route PATCH /api/cart/update/:productId/:variantId
 * @desc Update cart item quantity
 * @access Private (User)
*/
router.patch('/update/:productId/:variantId', authenticateUser, updateCartItemQuantity)

/**
 * @route DELETE /api/cart/remove/:productId/:variantId
 * @desc Remove item from cart
 * @access Private (User)
*/
router.delete('/remove/:productId/:variantId', authenticateUser, removeFromCart)

export default router;