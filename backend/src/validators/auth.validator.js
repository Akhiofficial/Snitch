import { body, validationResult } from "express-validator";


function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const validateRegister = [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    body("contact").notEmpty().withMessage("Contact is required"),
    body("fullname").notEmpty().withMessage("Fullname is required"),
    body("isSeller").optional().isBoolean().withMessage("isSeller must be a boolean"),

    
    validateRequest
];

const validateLogin = [
    body("username").optional(),
    body("contact").optional(),
    body("password").notEmpty().withMessage("Password is required"),
    body("isSeller").optional().isBoolean().withMessage("isSeller must be a boolean"),
    validateRequest
];




export { validateRegister, validateRequest, validateLogin };