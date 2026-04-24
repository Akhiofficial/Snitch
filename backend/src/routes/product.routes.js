import express from "express";
import { authenticateSeller } from "../middlewear/auth.middlewear.js";
import { createProduct, getSellerProducts, getProductById, getAllProducts, addVariant, updateVariantStock, deleteVariant } from "../controllers/product.controller.js";

import multer from "multer";


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    }
});
const router = express.Router();


/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Seller)
*/
router.post('/', authenticateSeller, upload.array("images", 6), createProduct)


/**
 * @route GET /api/products/seller
 * @desc Get all products of authenticated seller
 * @access Private (Seller)
*/
router.get('/seller', authenticateSeller, getSellerProducts)

/**
 * @route GET /api/products
 * @desc Get all products
 * @access Public
*/
router.get('/', getAllProducts)

/**
 * @route GET /api/products/:id
 * @desc Get product by ID
 * @access Public
 */
router.get('/:id', getProductById)

// ─── Variant Routes ───────────────────────────────────────────────────────────

/**
 * @route POST /api/products/:id/variants
 * @desc Add a variant to a product (optional images, optional price, ≥1 attribute required)
 * @access Private (Seller)
 */
router.post('/:id/variants', authenticateSeller, upload.array("variantImages", 5), addVariant)

/**
 * @route PATCH /api/products/:id/variants/:vid
 * @desc Update the stock of a specific variant
 * @access Private (Seller)
 */
router.patch('/:id/variants/:vid', authenticateSeller, updateVariantStock)

/**
 * @route DELETE /api/products/:id/variants/:vid
 * @desc Delete a specific variant
 * @access Private (Seller)
 */
router.delete('/:id/variants/:vid', authenticateSeller, deleteVariant)

export default router;