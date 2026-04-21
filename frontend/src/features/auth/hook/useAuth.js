import { setUser, setLoading, setError } from "../state/auth.slice";
import { registerUser, loginUser } from "../service/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {

    const dispatch = useDispatch();

    async function handleRegister(username, email, password, contact, fullname , isSeller=false) {
        const data = await registerUser({ username, email, password, contact, fullname , isSeller});
        dispatch(setUser(data.user));

        dispatch(setLoading(false));

        return data;
    }

    async function handleLogin(username, password, contact) {
        try {
            setLoading(true);
            const response = await loginUser({ username, password, contact });
            setUser(response.user);
            setLoading(false);
            return response;
        } catch (error) {
            setError(error);
            setLoading(false);
            throw error;
        }
    }


    return {
        handleRegister,
        handleLogin
    }
}