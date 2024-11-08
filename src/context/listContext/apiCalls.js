import axiosInstance from "../../api/axiosInstance";
import { createListFailure, createListStart, createListSuccess, deleteListFailure, deleteListStart, deleteListSuccess, getListsFailure, getListsStart, getListsSuccess, updateListFailure, updateListStart, updateListSuccess } from "./ListAction";

export const getLists = async (dispatch) => {
    dispatch(getListsStart());
    try {
        const res = await axiosInstance.get(`lists/`);
        dispatch(getListsSuccess(res.data));
    } catch (error) {
        console.error("Failed to fetch lists:", error);
        dispatch(getListsFailure());
    }
}

export const createList = async (list, dispatch, navigate) => {
    dispatch(createListStart());
    try {
        const res = await axiosInstance.post(`lists/`, list);
        dispatch(createListSuccess(res.data));
        navigate('/lists')
    } catch (error) {
        console.error("Failed to create list:", error);
        dispatch(createListFailure());
    }
};

export const updateList = async (list, dispatch, navigate) => {
    dispatch(updateListStart());
    try {
        const res = await axiosInstance.put(`lists/${list._id}`, list);
        dispatch(updateListSuccess(res.data));
        navigate('/lists')
    } catch (error) {
        console.error("Failed to update list:", error);
        dispatch(updateListFailure());
    }
};


export const deleteList = async (id, dispatch) => {
    dispatch(deleteListStart());
    try {
        await axiosInstance.delete(`lists/${id}`)
        dispatch(deleteListSuccess(id));
    } catch (error) {
        console.error("Failed to delete lists:", error);
        dispatch(deleteListFailure());
    }
};
