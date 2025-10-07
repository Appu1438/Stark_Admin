import axiosInstance from "../../api/axiosInstance";
import { getRidesFailure, getRidesStart, getRidesSuccess } from "./RideAction";

export const getRides = async (dispatch, toast) => {
    dispatch(getRidesStart());
    try {
        const res = await axiosInstance.get(`/admin/rides`);
        // console.log(res.data.data)
        dispatch(getRidesSuccess(res.data.data));
        toast.success("Rides Fetched Successfully!");
    } catch (error) {
        console.error("Failed to fetch rides:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch rides");
        dispatch(getRidesFailure());
    }
}