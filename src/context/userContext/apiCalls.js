import axiosInstance from "../../api/axiosInstance";
import { createUserFailure, createUserStart, createUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, getUsersFailure, getUsersStart, getUsersSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "./UserAction";

export const getUsers = async (dispatch) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosInstance.get(`/admin/users`);
        dispatch(getUsersSuccess(res.data.users));
    } catch (error) {
        console.error("Failed to fetch users:", error);
        dispatch(getUsersFailure());
    }
}

export const updateUser = async (user, dispatch, navigate) => {
    dispatch(updateUserStart());
    try {
        const res = await axiosInstance.put(`/admin/users/${user._id}`, user);
        dispatch(updateUserSuccess(res.data));
        navigate('/')
    } catch (error) {
        console.error("Failed to update user:", error);
        dispatch(updateUserFailure());
    }
};
