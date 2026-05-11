import { config } from "../config/config.ts";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";




async function sendTokenResponse(user, res, message) {

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, config.JWT_SECRET, { expiresIn: "7d" });


    const cookieOptions = {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        message,
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    });

}


const registerUser = async (req, res) => {
    // destructuring the request body
    const { username, email, password, contact, fullname, isSeller } = req.body;

    try {
        // checking if user already exists
        const existingUser = await userModel.findOne({
            $or: [{ contact }, { email }]
        });
        // exiting user in db 
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                existingUser
            });
        }
        // creating user in db
        const user = await userModel.create({
            username,
            email,
            password,
            contact,
            fullname,
            role: isSeller ? "seller" : "buyer"
        });

        await sendTokenResponse(user, res, "User registered successfully");

    } catch (error) {
        // handling error
        res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    // destructuring the request body
    const { username, password, contact } = req.body;

    try {
        // checking if user exists
        const user = await userModel.findOne({ $or: [{ username }, { contact }] });
        // user not found
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // checking password
        const isPasswordValid = await user.comparePassword(password);
        // invalid password
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // sending response to client
        await sendTokenResponse(user, res, "User logged in successfully");
    } catch (error) {
        // handling error
        res.status(500).json({ message: error.message });
    }
}

const googleCallback = async (req, res) => {
    const { id, displayName, emails, photos } = req.user
    const email = emails[0].value;
    const profilePicture = photos[0].value;

    let user = await userModel.findOne({ email });

    if (!user) {
        user = await userModel.create({
            email,
            googleId: id,
            username: displayName,
            fullname: displayName,
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            
        },
        config.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const cookieOptions = {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie("token", token, cookieOptions);

    res.redirect(config.FRONTEND_URL);

}

const getMe = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({
            message: "User fetched successfully",
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

const logoutUser = async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        };
        res.clearCookie("token", cookieOptions);
        res.status(200).json({
            message: "User logged out successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

export { registerUser, loginUser, googleCallback, getMe, logoutUser };