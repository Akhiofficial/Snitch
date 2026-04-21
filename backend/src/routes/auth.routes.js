import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";

const router = Router();

/*
 @route POST /api/auth/register
 @desc Register a new user
 @access Public
*/
router.post('/register', validateRegister, registerUser);

/*
 @route POST /api/auth/login
 @desc Login a user
 @access Public
*/
router.post('/login', validateLogin, loginUser);

export default router;