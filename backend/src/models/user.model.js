import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    photos: {
        type: String
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },
    contact: {
        type: String,
        required: false,
    },
    fullname: {
        type: String
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    },
    googleId: {
        type: String,
    }
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;