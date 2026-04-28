import { useDispatch, useSelector } from "react-redux";
import * as cartApi from "../service/cart.api";
import { setCartData, setLoading, setError } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();
    const { items, totalAmount, totalItems, loading, error } = useSelector((state) => state.cart);

    async function handleFetchCart() {
        dispatch(setLoading(true));
        try {
            const data = await cartApi.getCart();
            dispatch(setCartData(data.cart));
            return data.cart;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to fetch cart";
            dispatch(setError(message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleAddItem({ productId, variantId }) {
        dispatch(setLoading(true));
        try {
            const data = await cartApi.addItem({ productId, variantId });
            // Refresh cart after adding
            await handleFetchCart();
            return data;
        } catch (error) {
            console.error("Add to cart error:", error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleUpdateQuantity({ productId, variantId, quantity }) {
        try {
            const data = await cartApi.updateQuantity({ productId, variantId, quantity });
            dispatch(setCartData(data.cart));
            return data.cart;
        } catch (error) {
            console.error("Update quantity error:", error);
            throw error;
        }
    }

    async function handleRemoveItem({ productId, variantId }) {
        try {
            const data = await cartApi.removeItem({ productId, variantId });
            dispatch(setCartData(data.cart));
            return data.cart;
        } catch (error) {
            console.error("Remove item error:", error);
            throw error;
        }
    }

    return { 
        items, 
        totalAmount,
        totalItems,
        loading, 
        error, 
        handleAddItem, 
        handleFetchCart, 
        handleUpdateQuantity, 
        handleRemoveItem 
    }
}
