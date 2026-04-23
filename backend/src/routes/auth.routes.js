import { Router } from "express";
import { registerUser, loginUser, googleCallback, getMe } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";
import passport from "passport";
import { config } from "../config/config.ts";
import { authenticateUser } from "../middlewear/auth.middlewear.js";



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

/*
 @route GET /api/auth/google
 @desc Google OAuth
 @access Public
*/
router.get('/google',
    passport.authenticate('google',
        {
            scope: ['profile', 'email']

        }));

/*
 @route GET /api/auth/google/callback
 @desc Google OAuth Callback
 @access Public
*/
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: config.NODE_ENV === "development" ? "http://localhost:5173/login" : "/login"
    }),
    googleCallback
);

/*
 @route GET /api/auth/me
 @desc Get current user
 @access Private
*/
router.get("/me", authenticateUser, getMe)


export default router;