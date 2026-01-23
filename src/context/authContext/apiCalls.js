
import axios from 'axios'
import { fetchUserFailure, fetchUserStart, fetchUserSuccess, loginFailure, loginStart, loginSuccess } from './AuthAction'
import axiosInstance from '../../api/axiosInstance'

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const login = async (user, dispatch) => {
    dispatch(loginStart());

    try {
        const res = await axiosInstance.post(`/admin/login`, user);

        console.log("Login Response:", res);

        dispatch(loginSuccess(res.data.admin));

        // ✅ Show toast on success
        toast.success("Login successful 🎉", {
            position: "top-right",
            autoClose: 3000,
        });
    } catch (error) {
        console.error("Login error:", error);

        dispatch(loginFailure());

        // ✅ Show toast on error
        toast.error(
            error.response?.data?.message || "Login failed. Please try again.",
            {
                position: "top-right",
                autoClose: 4000,
            }
        );
    }
};


export const logout = async (user) => {
    try {

        console.log(user)
        const response = await axiosInstance.post(`/admin/logout/${user._id}`);
        if (response.status == 200) {
            localStorage.removeItem('user'); // Clear user data
            window.location.href = '/login'; // Redirect to login page
            localStorage.setItem('activeMenu', 'home')
        }
    } catch (error) {
        // toast.error("Logout failed", { autoClose: 3000 });
        console.log(error)
    }
}


export const refresh = async () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);

    try {
        console.log('Attempting to refresh token');
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/refresh`,{},{withCredentials:true});

        const { accessToken } = response.data;
        const updatedUser = { ...user, accessToken };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        return accessToken;

    } catch (error) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        logout(storedUser);
        console.error('Error refreshing token:', error);
    }
};
