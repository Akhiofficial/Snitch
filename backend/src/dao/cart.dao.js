import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export const fetchCartData = async (userId) => {
    let cart = await cartModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        { $unwind: { path: '$items' } },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'items.product'
            }
        },
        { $unwind: { path: '$items.product' } },
        {
            $addFields: {
                "items.product.variantDetails": {
                    $first: {
                        $filter: {
                            input: "$items.product.variants",
                            as: "v",
                            cond: { $eq: ["$$v._id", "$items.variant"] }
                        }
                    }
                },
                itemPrice: {
                    price: {
                        $multiply: [
                            '$items.quantity',
                            '$items.price.amount'
                        ]
                    },
                    currency: '$items.price.currency'
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                totalPrice: { $sum: '$itemPrice.price' },
                currency: {
                    $first: '$itemPrice.currency'
                },
                items: { $push: '$items' }
            }
        }
    ]);

    if (cart.length > 0) {
        return cart[0];
    } else {
        let emptyCart = await cartModel.findOne({ user: userId });
        if (!emptyCart) {
            emptyCart = await cartModel.create({ user: userId, items: [] });
        }
        return { ...emptyCart.toObject(), totalPrice: 0, currency: "INR", items: [] };
    }
};