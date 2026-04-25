import mongoose from "mongoose";
import priceSchema from "./price.schema";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product.variants"
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: priceSchema,
                required: true
            }
        }
    ]
}, { timestamps: true });

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;