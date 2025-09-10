import axios from "axios";
import { FaBatteryThreeQuarters } from "react-icons/fa";
import { create } from "zustand";
//tutorial from burakorkmez
const API_URL = "http://localhost:5050/api";
axios.defaults.withCredentials = true;

export const authUser = create((set) => ({
    user: null,
    isAuthenticated: false,
    isChecking: true,
    message: null,
    error: null,

    signUp: async (username, email, password) => {
        try {
            const res = await axios.post(`${API_URL}/signup`, { username, email, password });
            set({
                user: res.data.user,
                isAuthenticated: true
            });
            return true;
        } catch (error) {
            set({
                error: error.res?.data?.message || "Error Signing up",
            });
            console.error(" signup failed", error);
        }
    },
    login: async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password });
            set({
                user: res.data.user,
                isAuthenticated: true
            });
            return true;
        } catch (error) {
            set({
                error: error.res?.data?.message || "Error Logging in",
            });

            console.error(" login failed", error);
        }
    },
    logOut: async () => {
        try {
            await axios.post(`${API_URL}/logout`);
            set({
                user: null,
                isAuthenticated: false
            });
        } catch (error) {
            set({
                error: error.res.data.message || "Error Logging Out",
            });
            console.error(" Logout failed", error);
        }
    },
    checkAuth: async () => {
        set({isChecking: true, error: null})
        try {
            const res = await axios.get(`${API_URL}/checking`);
            set({
                isAuthenticated: true,
                user: res.data.user,
                isChecking: false
            });
        } catch (error) {
            set({
                isChecking: false,
                isAuthenticated: false
            });
            console.error(" Auth check failed", error);
        }
    },


}))

