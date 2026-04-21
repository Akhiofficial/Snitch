import axios from "axios";




const authApiInstance = axios.create({
    baseURL: "/api/auth",
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