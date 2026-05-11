import { setUser, setLoading, setError, clearAuth } from "../state/auth.slice";
import { registerUser, loginUser, getMe, logout } from "../service/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {

    const dispatch = useDispatch();

    async function handleRegister(userData) {
        try {
            dispatch(setLoading(true));
            const data = await registerUser(userData);
            dispatch(setUser(data.user));
            dispatch(setLoading(false));
            return data.user;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }

    async function handleLogin(credentials) {
        try {
            dispatch(setLoading(true));
            const data = await loginUser(credentials);
            dispatch(setUser(data.user));
            dispatch(setLoading(false));
            return data.user;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }


    async function handleGetMe() {
        try {
            const data = await getMe();
            dispatch(setUser(data.user));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }


    async function handleLogout() {
        try {
            await logout();
            dispatch(clearAuth());
        } catch (error) {
            console.error("Logout failed:", error);
            // Even if API fails, we clear state to prevent being stuck
            dispatch(clearAuth());
        }
    }


    function clearAuthError() {
        dispatch(setError(null));
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
        clearAuthError
    }
}
