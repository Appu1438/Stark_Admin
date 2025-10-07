import axiosInstance from "../../api/axiosInstance";
import { createFaresFailure, createFaresStart, createFaresSuccess, getFaresFailure, getFaresStart, getFaresSuccess, updateFaresFailure, updateFaresStart, updateFaresSuccess } from "./FareAction";

export const getFares = async (dispatch, toast) => {
    dispatch(getFaresStart());
    try {
        const res = await axiosInstance.get(`/fare/get-fares`);
        console.log(res.data.data)
        dispatch(getFaresSuccess(res.data.data));
        toast.success("Fare Details Fetched Successfully!");
    } catch (error) {
        console.error("Failed to fetch fare details:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch fares");
        dispatch(getFaresFailure());
    }
}
export const createFare = async (dispatch, toast, data, setShowModal) => {
    dispatch(createFaresStart());
    try {
        const res = await axiosInstance.post(`/fare/create-fare`, data);
        console.log(res.data.data)
        dispatch(createFaresSuccess(res.data.data));
        toast.success("Fare Details Created Successfully!");
        setShowModal(false)
    } catch (error) {
        console.error("Failed to create fare details:", error);
        toast.error(error?.response?.data?.message || "Failed to create fares");
        dispatch(createFaresFailure());
        setShowModal(false)
    }
}
export const updateFare = async (dispatch, toast, data, setShowModal) => {
    dispatch(updateFaresStart());
    try {
        const res = await axiosInstance.patch(`/fare/update-fare`, data);
        console.log(res.data.data)
        dispatch(updateFaresSuccess(res.data.data));
        toast.success("Fare Details Updated Successfully!");
        setShowModal(false)
    } catch (error) {
        console.error("Failed to update fare details:", error);
        toast.error(error?.response?.data?.message || "Failed to upadte fares");
        dispatch(updateFaresFailure());
        setShowModal(false)
    }
}