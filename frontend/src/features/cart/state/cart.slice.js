import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        totalPrice: 0,
        currency: "INR",
        loading: false,
        error: null
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload?.items || [];
            state.totalPrice = action.payload?.totalPrice || 0;
            state.currency = action.payload?.currency || "INR";
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
    
});

export const { setCart, setLoading, setError } = cartSlice.actions;
export default cartSlice.reducer;