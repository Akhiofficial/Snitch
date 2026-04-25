import express from "express";
import { authenticateUser } from "../middlewear/auth.middlewear.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";
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

export default router;