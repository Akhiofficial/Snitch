import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const authApiInstance = axios.create({
    baseURL: `${BASE_URL}/api/auth`,
    withCredentials: true
});


export async function registerUser({ username, email, password, contact, fullname , isSeller=false}) {
    try {
        const response = await authApiInstance.post("/register", {
            username,
            email,
            password,
            contact,
            fullname,
            isSeller
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

 /**
 * @url http://localhost:3000/api/auth/login
 */
export async function loginUser({ username, password, contact }) {
    try {
        const response = await authApiInstance.post("/login", {
            username,
            password,
            contact
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getMe() {
    try {
        const response = await authApiInstance.get("/me");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function logout() {
    try {
        const response = await authApiInstance.get("/logout");
        return response.data;
    } catch (error) {
        throw error;
    }
}