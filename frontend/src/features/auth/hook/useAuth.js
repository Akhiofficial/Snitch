import { setUser, setLoading, setError } from "../state/auth.slice";
import { registerUser, loginUser } from "../service/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {

    const dispatch = useDispatch();

    async function handleRegister(userData) {
        try {
            dispatch(setLoading(true));
            const data = await registerUser(userData);
            dispatch(setUser(data.user));
            dispatch(setLoading(false));
            return data;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }

    async function handleLogin(credentials) {
        try {
            dispatch(setLoading(true));
            const response = await loginUser(credentials);
            dispatch(setUser(response.user));
            dispatch(setLoading(false));
            return response;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }



    function clearAuthError() {
        dispatch(setError(null));
    }

    return {
        handleRegister,
        handleLogin,
        clearAuthError
    }
}