import mongoose from "mongoose";
import priceSchema from "./price.schema";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: priceSchema,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    stock: { type: Number, required: true },
    sizes: {
        type: [String],
        default: []
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    variants: [
        {
            images: [{
                url: {
                    type: String
                }
            }],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: priceSchema
        }
    ]
}, { timestamps: true });

const productModel = mongoose.model("product", productSchema);

export default productModel;