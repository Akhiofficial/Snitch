import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const cartApiInstance = axios.create({
    baseURL: `${BASE_URL}/api/cart`,
    withCredentials: true
});

export const addItem = async ({ productId, variantId }) => {
    const vId = variantId || 'none';
    const response = await cartApiInstance.post(`/add/${productId}/${vId}`, {
        quantity: 1
    });

    return response.data;
}

export const getCart = async () => {
    const response = await cartApiInstance.get("/");
    return response.data;
}

export const updateQuantity = async ({ productId, variantId, quantity }) => {
    const vId = variantId || 'none';
    const response = await cartApiInstance.patch(`/update/${productId}/${vId}`, {
        quantity
    });
    return response.data;
}

export const removeItem = async ({ productId, variantId }) => {
    const vId = variantId || 'none';
    const response = await cartApiInstance.delete(`/remove/${productId}/${vId}`);
    return response.data;
}

export const createCartOrder = async () => {
    const response = await cartApiInstance.post(`/payment/create/order`);
    return response.data;
}

export const verifyCartOrder = async ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
}) => {
    const response = await cartApiInstance.post(`/payment/verify/order`, {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    });
    return response.data;
}