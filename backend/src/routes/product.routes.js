import express from "express";
import { authenticateSeller } from "../middlewear/auth.middlewear.js";
import { createProduct } from "../controllers/product.controller.js";
import multer from "multer";


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    }
});
const router = express.Router();

router.post('/', authenticateSeller, upload.array("images", 6), createProduct)


export default router;