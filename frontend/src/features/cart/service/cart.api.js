import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
});

export const addItem = async ({ productId, variantId }) => {
    const vId = variantId || 'none';
    const response = await cartApiInstance.post(`/add/${productId}/${vId}`, {
        quantity: 1
    });

    return response.data;
} 