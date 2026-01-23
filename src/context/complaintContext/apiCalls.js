import axiosInstance from "../../api/axiosInstance";
import { getComplaintsFailure, getComplaintsStart, getComplaintsSuccess, updateComplaintsFailure, updateComplaintsStart, updateComplaintsSuccess } from "./ComplaintAction";

export const getComplaints = async (dispatch, toast) => {
    dispatch(getComplaintsStart());
    try {
        const res = await axiosInstance.get(`/complaints/get-all-complaints`);
        dispatch(getComplaintsSuccess(res.data.data));
        console.log(res.data.data)
        toast.success("Complaints fetched successfully!");
    } catch (error) {
        console.error("Failed to fetch complaints:", error);
        dispatch(getComplaintsFailure());
        toast.error(error.response?.data?.message || "Failed to fetch complaints!");
    }
};

export const markComplaintInReview = async (dispatch, toast, id) => {
    dispatch(updateComplaintsStart());
    try {
        const res = await axiosInstance.patch(`/complaints/${id}/in-review`);
        dispatch(updateComplaintsSuccess(res.data.data));
        console.log(res.data.data)
        toast.success("Complaint Marked successfully!");
    } catch (error) {
        console.error("Failed to mark complaint:", error);
        dispatch(updateComplaintsFailure());
        toast.error(error.response?.data?.message || "Failed to mark complaints!");
    }
};

export const markComplaintAsResolve = async (dispatch, toast, id, adminResponse) => {
    dispatch(updateComplaintsStart());
    try {
        const res = await axiosInstance.patch(`/complaints/${id}/resolve`, { adminResponse });
        dispatch(updateComplaintsSuccess(res.data.data));
        console.log(res.data.data)
        toast.success("Complaint Resolved successfully!");
    } catch (error) {
        console.error("Failed to resolve complaints:", error);
        dispatch(updateComplaintsFailure());
        toast.error(error.response?.data?.message || "Failed to resolve complaints!");
    }
};