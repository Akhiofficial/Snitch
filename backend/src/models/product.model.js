import mongoose from "mongoose";

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
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: "INR", enum: ["INR", "USD", "GBP", "EUR"] }
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
            price: {
                amount: {
                    type: Number
                },
                currency: {
                    type: String,
                    default: "INR",
                    enum: ["INR", "USD", "GBP", "EUR"]
                }
            }
        }
    ]
}, { timestamps: true });

const productModel = mongoose.model("product", productSchema);

export default productModel;