import { createProduct, getSellerProducts } from "../services/product.api";
import { setSellerProducts, setLoading, setError } from "../state/product.slice";
import { useDispatch } from "react-redux";


export const useProduct = () => {

    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        try {
            dispatch(setLoading(true));
            const data = await createProduct(formData);
            dispatch(setLoading(false));
            return data.product;
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

    return {
        handleCreateProduct,
        handleGetSellerProducts
    }

}