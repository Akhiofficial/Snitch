import { createProduct, getAllProducts, getSellerProducts } from "../services/product.api";
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

    return {
        handleCreateProduct,
        handleGetSellerProducts,
        handleGetAllProducts,
        handleGetProductById
    }

}