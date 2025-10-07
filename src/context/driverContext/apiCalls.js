import axiosInstance from "../../api/axiosInstance";
import { approveDriverFailure, approveDriverStart, approveDriverSuccess, deApproveDriverFailure, deApproveDriverStart, deApproveDriverSuccess, getDriversFailure, getDriversStart, getDriversSuccess, updateDriverFailure, updateDriverStart, updateDriverSuccess } from "./DriverAction";

export const getDrivers = async (dispatch, toast) => {
    dispatch(getDriversStart());
    try {
        const res = await axiosInstance.get(`/admin/drivers`);
        dispatch(getDriversSuccess(res.data.drivers));
        toast.success("Driver Fetched Successfully!");
        console.log(res.data.drivers)
    } catch (error) {
        console.error("Failed to fetch drivers:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch drivers");

        dispatch(getDriversFailure());
    }
}
export const approveDriver = async (driver, dispatch, navigate, toast, remark) => {
    dispatch(approveDriverStart());
    try {
        const res = await axiosInstance.patch(`/admin/drivers/approve/${driver._id}`, { remark }); // ✅ use PUT
        dispatch(approveDriverSuccess(res.data.data));
        toast.success("Driver Approved Successfully!");
        // navigate can be optional, e.g., redirect to list
        // navigate("/approved-drivers");  
        // localStorage.setItem('activeMenu', "approved-drivers")
    } catch (error) {
        console.error("Failed to approve driver:", error);
        dispatch(approveDriverFailure());
        toast.error(
            error?.response?.data?.message || "Failed to approve driver!"
        );
    }
};
export const deApproveDriver = async (driver, dispatch, navigate, toast, remark) => {
    dispatch(deApproveDriverStart());
    try {
        const res = await axiosInstance.patch(`/admin/drivers/deapprove/${driver._id}`, { remark }); // ✅ use PUT
        dispatch(deApproveDriverSuccess(res.data.data));
        toast.success("Driver De-Approved Successfully!");
        // navigate can be optional, e.g., redirect to list
        // navigate("/approved-drivers");  
        // localStorage.setItem('activeMenu', "approved-drivers")
    } catch (error) {
        console.error("Failed to De-Approve driver:", error);
        dispatch(deApproveDriverFailure());
        toast.error(
            error?.response?.data?.message || "Failed to De-Approve driver!"
        );

    }
};


export const updateDriver = async (driverId, driver, dispatch, remark, toast) => {
    // console.log(driverId)
    dispatch(updateDriverStart());
    try {
        const res = await axiosInstance.put(`/admin/drivers/${driverId}`, { driver, remark });
        dispatch(updateDriverSuccess(res.data.data));
        toast.success("Driver Updated Successfully!");
    } catch (error) {
        console.error("Failed to update driver:", error);
        dispatch(updateDriverFailure());
        toast.error(
            error?.response?.data?.message || "Failed to update driver!"
        );
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

