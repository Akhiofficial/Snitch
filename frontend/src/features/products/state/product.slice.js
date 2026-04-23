import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sellerProducts: [],
    loading: false,
    error: null,
}

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { setSellerProducts, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;