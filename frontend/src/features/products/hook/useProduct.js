import { createProduct, getAllProducts, getSellerProducts, getProductById, updateProduct, deleteProduct, addProductVariant, updateVariantStock, deleteProductVariant, updateProductVariant } from "../services/product.api";
import { setSellerProducts, setLoading, setError, setAllProducts } from "../state/product.slice";
import { useDispatch } from "react-redux";


export const useProduct = () => {

    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        try {
            dispatch(setLoading(true));
            const data = await createProduct(formData);
            dispatch(setLoading(false));
            // Backend returns the product object directly at root (not wrapped in { product })
            return data._id ? data : (data.product ?? null);
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.response?.data?.message || error.message));
            return null;
        }
    }

    async function handleGetSellerProducts() {
        try {
            dispatch(setLoading(true));
            const data = await getSellerProducts();
            dispatch(setLoading(false));
            dispatch(setSellerProducts(data.products));
            return data.products;
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.response?.data?.message || error.message));
            return null;
        }
    }

    async function handleGetAllProducts() {
        try {
            dispatch(setLoading(true));
            const data = await getAllProducts();
            dispatch(setLoading(false));
            dispatch(setAllProducts(data.products));
            return data.products;
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.response?.data?.message || error.message));
            return null;
        }
    }

    async function handleGetProductById(productId) {
        try {
            dispatch(setLoading(true));
            const data = await getProductById(productId);
            dispatch(setLoading(false));
            return data.product;
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.response?.data?.message || error.message));
            return null;
        }
    }

    // main product
    async function handleUpdateProduct(productId, formData) {
        try {
            dispatch(setLoading(true));
            const data = await updateProduct(productId, formData);
            dispatch(setLoading(false));
            return data.product;
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.response?.data?.message || error.message));
            return null;
        }
    }

    // main product 
    async function handleDeleteProduct(productId) {
        try {
            dispatch(setLoading(true));
            const data = await deleteProduct(productId);
            dispatch(setLoading(false));
            return data;
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.response?.data?.message || error.message));
            return null;
        }
    }

    async function handleRegisterVariant(productId, formData) {
        try {
            dispatch(setLoading(true));
            const data = await addProductVariant(productId, formData);
            dispatch(setLoading(false));
            return data;
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.response?.data?.message || error.message));
            return null;
        }
    }

    async function handleUpdateVariantStock(productId, variantId, stock) {
        try {
            dispatch(setLoading(true));
            const data = await updateVariantStock(productId, variantId, stock);
            dispatch(setLoading(false));
            return data;
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.response?.data?.message || error.message));
            return null;
        }
    }

    async function handleDeleteVariant(productId, variantId) {
        try {
            dispatch(setLoading(true));
            const data = await deleteProductVariant(productId, variantId);
            dispatch(setLoading(false));
            return data;
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.response?.data?.message || error.message));
            return null;
        }
    }

    async function handleUpdateVariant(productId, variantId, formData) {
        try {
            dispatch(setLoading(true));
            const data = await updateProductVariant(productId, variantId, formData);
            dispatch(setLoading(false));
            return data;
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.response?.data?.message || error.message));
            return null;
        }
    }

    return {
        handleCreateProduct,
        handleGetSellerProducts,
        handleGetAllProducts,
        handleGetProductById,
        handleUpdateProduct,
        handleDeleteProduct,
        handleRegisterVariant,
        handleUpdateVariantStock,
        handleDeleteVariant,
        handleUpdateVariant
    }

}