import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        totalAmount: 0,
        totalItems: 0,
        loading: false,
        error: null
    },
    reducers: {
        setCartData: (state, action) => {
            state.items = action.payload.items;
            state.totalAmount = action.payload.totalAmount;
            state.totalItems = action.payload.totalItems;
        },
        setItems: (state, action) => {
            state.items = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        updateItemQuantity: (state, action) => {
            const { productId, variantId, quantity } = action.payload;
            const item = state.items.find(i => 
                i.product._id === productId && i.variant === variantId
            );
            if (item) item.quantity = quantity;
        },
        removeItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.filter(i => 
                !(i.product._id === productId && i.variant === variantId)
            );
        }
    }
});

export const { setCartData, setItems, setLoading, setError, updateItemQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;