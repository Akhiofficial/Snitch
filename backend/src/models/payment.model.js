import mongoose from "mongoose";
import priceSchema from "./price.schema";

const paymentSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    price: {
        type: priceSchema,
        required: true
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    orderItems: [
        {
            title: String,
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            variantId: {
                type: mongoose.Schema.Types.ObjectId,
                default: null
            },
            quantity: Number,
            price: priceSchema,
            images: [{
                url: String
            }],
            description: String
        }
    ]
});


const paymentModel = mongoose.model("payment", paymentSchema);

export default paymentModel;