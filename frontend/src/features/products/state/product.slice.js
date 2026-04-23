import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sellerProducts: [],
    loading: false,
    error: null,
    products: []
}

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload;
        },
        setAllProducts: (state, action) => {
            state.products = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { setSellerProducts, setLoading, setError, setAllProducts } = productSlice.actions;
export default productSlice.reducer;