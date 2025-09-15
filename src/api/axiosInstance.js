import axios from 'axios';
import { logout, refresh } from '../context/authContext/apiCalls';

const storedUser = JSON.parse(localStorage.getItem('user'));

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Set the base URL
    headers: {
        'Content-Type': 'application/json', // Set common headers
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Conditionally add the Authorization header if the token is available
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.accessToken) {
            config.headers['Authorization'] = `Bearer ${storedUser.accessToken}`;
        } else {
            console.log("No user token found");
        }
        // Example of adding another custom header
        config.headers['X-Custom-Header'] = 'customHeaderValue';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);



// Axios response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle only 401 (unauthorized, expired/invalid token)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // try {
            //     console.log("Attempting to refresh token");

            //     const accessToken = await refresh();
            //     console.log("New access token:", accessToken);

            //     // Retry original request with new token
            //     originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            //     return axiosInstance(originalRequest);
            // } catch (refreshError) {
                logout(storedUser);
            //     return Promise.reject(refreshError);
            // }
        }

        // // If it's 403, just reject → means role issue or account inactive
        // if (error.response && error.response.status === 403) {
        //     console.warn("Access denied due to role/permission issue");
        //     logout(); // or redirect to "No Access" page if you prefer
        // }

        return Promise.reject(error);
    }
);


export default axiosInstance;
