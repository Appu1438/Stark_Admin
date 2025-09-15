import axiosInstance from "../../api/axiosInstance";
import { activateAdminFailure, activateAdminStart, activateAdminSuccess, createAdminFailure, createAdminStart, createAdminSuccess, deActivateAdminFailure, deActivateAdminStart, deActivateAdminSuccess, getAdminsFailure, getAdminsStart, getAdminsSuccess, updateAdminFailure, updateAdminStart, updateAdminSuccess } from "./AdminAction";

export const getAdmins = async (dispatch, toast) => {
    dispatch(getAdminsStart());
    try {
        const res = await axiosInstance.get(`/admins`);
        dispatch(getAdminsSuccess(res.data.data));
        console.log(res.data.admins)
        toast.success("Admins fetched successfully!");
    } catch (error) {
        console.error("Failed to fetch admins:", error);
        dispatch(getAdminsFailure());
        toast.error(error.response?.data?.message || "Failed to fetch admins!");
    }
};

export const activateAdmin = async (admin, dispatch, toast) => {
    dispatch(activateAdminStart());
    try {
        const res = await axiosInstance.patch(`/admins/activate/${admin._id}`);
        dispatch(activateAdminSuccess(res.data.data));
        // console.log(res.data.data)
        toast.success("Admin activated successfully!");
    } catch (error) {
        console.error("Failed to activate admin:", error);
        dispatch(activateAdminFailure());
        toast.error(error.response?.data?.message || "Failed to activate admin!");
    }
};

export const deActivateAdmin = async (admin, dispatch, toast) => {
    dispatch(deActivateAdminStart());
    try {
        const res = await axiosInstance.patch(`/admins/deactivate/${admin._id}`);
        dispatch(deActivateAdminSuccess(res.data.data));
        toast.success("Admin De-Activated successfully!");
    } catch (error) {
        console.error("Failed to De-Activate admin:", error);
        dispatch(deActivateAdminFailure());
        toast.error(error.response?.data?.message || "Failed to De-activate admin!");
    }
};

export const createAdmin = async (admin, dispatch, navigate, toast) => {
    dispatch(createAdminStart());
    try {
        const res = await axiosInstance.post(`/add`, admin);
        const newAdmin = res.data.data;

        dispatch(createAdminSuccess(newAdmin));
        toast.success("Admin Created Successfully!");

        // ✅ pass adminId in state
        navigate(`/admin/${newAdmin._id}`, { state: { adminId: newAdmin._id } });
    } catch (error) {
        console.error("Failed to Create admin:", error);
        dispatch(createAdminFailure());
        toast.error(error.response?.data?.message || "Failed to Create admin!");
    }
};
export const updateAdmin = async (adminId, admin, dispatch, remark, toast) => {
    dispatch(updateAdminStart());
    try {
        const res = await axiosInstance.put(`/admins/${adminId}`, { admin, remark });
        const newAdmin = res.data.data;

        dispatch(updateAdminSuccess(newAdmin));
        toast.success("Admin Updated Successfully!");
        return;

    } catch (error) {
        console.error("Failed to update admin:", error);
        dispatch(updateAdminFailure());
        toast.error(error.response?.data?.message || "Failed to update admin!");
        return;
    }
};

// export const deleteUser = async (id, dispatch) => {
//     dispatch(deleteUserStart());
//     try {
//         await axiosInstance.delete(`users/${id}`);
//         dispatch(deleteUserSuccess(id));
//     } catch (error) {
//         console.error("Failed to delete user:", error);
//         dispatch(deleteUserFailure());
//     }
// };

// export const updateUser = async (user, dispatch, navigate) => {
//     dispatch(updateUserStart());
//     try {
//         const res = await axiosInstance.put(`users/${user._id}`, user);
//         dispatch(updateUserSuccess(res.data));
//         navigate('/')
//     } catch (error) {
//         console.error("Failed to update user:", error);
//         dispatch(updateUserFailure());
//     }
// };
