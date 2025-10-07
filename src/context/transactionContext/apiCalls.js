import axiosInstance from "../../api/axiosInstance";
import { getTransactionsFailure, getTransactionsStart, getTransactionsSuccess } from "./TransactionAction";

export const getTransactions = async (dispatch, toast) => {
    dispatch(getTransactionsStart());
    try {
        const res = await axiosInstance.get(`/admin/transactions`);
        // console.log(res.data.data)
        dispatch(getTransactionsSuccess(res.data.data));
        toast.success("Transactions Fetched Successfully!");
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch transactions");
        dispatch(getTransactionsFailure());
    }
}