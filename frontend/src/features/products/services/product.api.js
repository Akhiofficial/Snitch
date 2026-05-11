import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const productApiInstance = axios.create({
    baseURL: `${BASE_URL}/api/products`,
    withCredentials: true
})


export async function createProduct(formData) {
    const response = await productApiInstance.post("/", formData);
    return response.data;
}

export async function getSellerProducts() {
    const response = await productApiInstance.get("/seller");
    return response.data;
}

export async function getProductById(id) {
    const response = await productApiInstance.get(`/${id}`);
    return response.data;
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/");
    return response.data;
}

// ─── Variant API ──────────────────────────────────────────────────────────────

/**
 * Add a variant to a product.
 * @param {string} productId
 * @param {FormData} formData - includes variantImages (up to 5), attributes[Key]=Value, priceAmount?, priceCurrency?, stock
 */
export async function addProductVariant(productId, formData) {

    const response = await productApiInstance.post(`/${productId}/variants`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

/**
 * Update stock of a specific variant.
 * @param {string} productId
 * @param {string} variantId
 * @param {number} stock
 */
export async function updateVariantStock(productId, variantId, stock) {
    const response = await productApiInstance.patch(`/${productId}/variants/${variantId}`, { stock });
    return response.data;
}

/**
 * Update all details of a specific variant.
 */
export async function updateProductVariant(productId, variantId, formData) {
    const response = await productApiInstance.put(`/${productId}/variants/${variantId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

/**
 * Delete a specific variant from a product.
 * @param {string} productId
 * @param {string} variantId
 */
export async function deleteProductVariant(productId, variantId) {
    const response = await productApiInstance.delete(`/${productId}/variants/${variantId}`);
    return response.data;
}

/**
 * Update main product details.
 */
export async function updateProduct(id, formData) {
    const response = await productApiInstance.patch(`/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

/**
 * Delete/Withdraw a product.
 */
export async function deleteProduct(id) {
    const response = await productApiInstance.delete(`/${id}`);
    return response.data;
}
