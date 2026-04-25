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