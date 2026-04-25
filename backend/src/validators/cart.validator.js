import { param, body, validationResult } from "express-validator";


const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Invalid Input", errors: errors.array() });
    }
    next();
}

export const validateAddToCart = [
    param("productId").notEmpty().withMessage("Product ID is required"),
    param("variantId").notEmpty().withMessage("Variant ID is required"),
    body("quantity").notEmpty().isInt({ min: 1 }).withMessage("Quantity must be a positive number"),
    validateRequest
]

