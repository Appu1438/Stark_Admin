
import axios from 'axios'
import { fetchUserFailure, fetchUserStart, fetchUserSuccess, loginFailure, loginStart, loginSuccess } from './AuthAction'
import axiosInstance from '../../api/axiosInstance'
import { REACT_APP_API_URL } from '../../api';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const login = async (user, dispatch) => {
    dispatch(loginStart());

    try {
        const res = await axiosInstance.post(`/login`, user);

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
        const response = await axiosInstance.post(`/logout/${user._id}`);
        if (response.status == 200) {
            localStorage.removeItem('user'); // Clear user data
            window.location.href = '/login'; // Redirect to login page
            localStorage.setItem('activeMenu', 'home')
        } else {
            console.log('Failed to logout')
        }

    } catch (error) {
        console.log(error)
    }

}


export const fetchUserDetailsIfOutdated = async (dispatch) => {
    dispatch(fetchUserStart())
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser) {
        try {
            const updatedUserResponse = await axiosInstance.get('auth/profile');
            const updatedProfile = updatedUserResponse.data;
            // Merge the existing access and refresh tokens with the updated profile data
            const mergedUser = {
                ...localUser, // Retain accessToken and refreshToken from localUser
                ...updatedProfile // Override other profile details from updated response
            };

            dispatch(fetchUserSuccess(mergedUser))
            // localStorage.setItem('user', JSON.stringify(mergedUser));
            console.log('Updated user details:', mergedUser);

        } catch (error) {
            dispatch(fetchUserFailure())
            console.log('Error fetching updated user data:', error);
        }
    }
};

export const refresh = async () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);

    try {
        console.log('Attempting to refresh token');
        const response = await axios.post(`${REACT_APP_API_URL}auth/refresh`, {}, { withCredentials: true });

        const { accessToken } = response.data;
        const updatedUser = { ...user, accessToken };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        return accessToken;

    } catch (error) {
        logout();
        console.error('Error refreshing token:', error);
    }
};
