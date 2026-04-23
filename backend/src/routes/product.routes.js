import express from "express";
import { authenticateSeller } from "../middlewear/auth.middlewear.js";
import { createProduct, getSellerProducts} from "../controllers/product.controller.js";
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


export default router;