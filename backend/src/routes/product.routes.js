import express from "express";
import { authenticateSeller } from "../middlewear/auth.middlewear.js";
import { createProduct, getSellerProducts, getProductById, getAllProducts} from "../controllers/product.controller.js";

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

export default router;