import { config } from "../config/config.ts";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";




async function sendTokenResponse(user, res, message) {

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, config.JWT_SECRET, { expiresIn: "7d" });


    res.cookie("token", token);

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
    const { username, password , contact } = req.body;

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

export { registerUser, loginUser };