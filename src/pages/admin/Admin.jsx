import {
    PermIdentity,
    MailOutline,
    CalendarToday,
    Badge,
    Timeline,
    Login,
    Logout,
    PhoneAndroid,
    PersonAdd,
    PersonOutline,
    Security,
    Block,
    Public
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import "./admin.css";
import { AdminContext } from '../../context/adminContext/AdminContext';
import { activateAdmin, deActivateAdmin, getAdmins, updateAdmin } from '../../context/adminContext/apiCalls';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

export default function Admin() {
    const location = useLocation();
    const navigate = useNavigate();
    const adminId = location.state.adminId;
    const { admins, dispatch } = useContext(AdminContext);
    const admin = admins?.find((a) => a._id === adminId);
    console.log(admin)
    const [isEditing, setIsEditing] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [approvalHistory, setApprovalHistory] = useState([]);

    const [updatedAdmin, setUpdatedAdmin] = useState({
        name: admin?.name || "",
        email: admin?.email || "",
        phone: admin?.phone || "",
        role: admin?.role || "Admin",
        status: admin?.status || "active",
        profileImage: admin?.profileImage || "",
        password: "",
        identityType: admin?.identityType || "Other",
        identityNumber: admin?.identityNumber || "",
        identityDocument: admin?.identityDocument || "",
        isVerified: admin?.isVerified || false,
        dob: admin?.dob ? new Date(admin.dob).toISOString().split("T")[0] : "",
        gender: admin?.gender || "Other",
        address: admin?.address || "",
        city: admin?.city || "",
        branch: admin?.branch || "",
        state: admin?.state || "",
        country: admin?.country || "India",
    });

    useEffect(() => {
        if (admin) {
            setUpdatedAdmin({
                name: admin.name || "",
                email: admin.email || "",
                phone: admin.phone || "",
                role: admin.role || "Admin",
                status: admin.status || "active",
                profileImage: admin.profileImage || "",
                password: "",
                identityType: admin.identityType || "Other",
                identityNumber: admin.identityNumber || "",
                identityDocument: admin.identityDocument || "",
                isVerified: admin.isVerified || false,
                dob: admin.dob ? new Date(admin.dob).toISOString().split("T")[0] : "",
                gender: admin.gender || "Other",
                address: admin.address || "",
                city: admin.city || "",
                branch: admin.branch || "",
                state: admin.state || "",
                country: admin.country || "India",
            });
        }
    }, [admin]);

    useEffect(() => {
        setShowHistoryModal(false);
        getAdmins(dispatch, toast);
    }, [dispatch]);

    useEffect(() => {
        if (!admin?._id) return;

        const getAdminApprovalHistory = async () => {
            try {
                const res = await axiosInstance.get(`/admins/history/${admin._id}`);
                if (res.data.success) {
                    const sortedHistory = res.data.data.history.sort(
                        (a, b) => new Date(b.actionOn) - new Date(a.actionOn)
                    );
                    console.log(res.data)
                    setApprovalHistory(sortedHistory);
                } else {
                    setApprovalHistory([]);
                }
            } catch (error) {
                console.error("Error fetching admin approval history:", error);
                setApprovalHistory([]);
            }
        };

        getAdminApprovalHistory();
    }, [admin]);;

    const handleChange = (e) => {
        setUpdatedAdmin({ ...updatedAdmin, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Create a shallow clone of admin for comparison
        const adminData = {
            name: admin.name || "",
            email: admin.email || "",
            phone: admin.phone || "",
            role: admin.role || "Admin",
            status: admin.status || "active",
            profileImage: admin.profileImage || "",
            password: "",
            identityType: admin.identityType || "Other",
            identityNumber: admin.identityNumber || "",
            identityDocument: admin.identityDocument || "",
            isVerified: admin.isVerified || false,
            dob: admin.dob ? new Date(admin.dob).toISOString().split("T")[0] : "",
            gender: admin.gender || "Other",
            address: admin.address || "",
            city: admin.city || "",
            branch: admin.branch || "",
            state: admin.state || "",
            country: admin.country || "India",
        };

        // Compare field by field
        const hasChanges = Object.keys(updatedAdmin).some((key) => {
            if (key === "password" && !updatedAdmin[key]) return false; // ignore empty password
            return updatedAdmin[key] !== adminData[key];
        });

        console.log("Has Changes?", hasChanges);

        if (!hasChanges) {
            toast.info("No changes detected.");
            setIsEditing(false);
            return;
        }
        const remark = prompt("Enter a remark for this action:");
        if (remark === null) return;
        await updateAdmin(adminId, updatedAdmin, dispatch, remark, toast);
        setIsEditing(false);
    };



    const handleApproval = () => {
        if (admin?.status === 'active') {
            deActivateAdmin(admin, dispatch, toast);
        } else {
            activateAdmin(admin, dispatch, toast);
        }
    };

    const handleDelete = (id) => {
        // deleteAdmin(id, dispatch); // implement later
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!admin) {
        return (
            <div className="adminDetail">
                <div className="adminTitleContainer">
                    <h1 className="adminTitle">Admin Details</h1>
                </div>
                <div className="noAdminFound">
                    <span>🚫</span>
                    <p>Admin not found or you are not granted to perform this.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="adminDetail">
            <div className="adminTitleContainer">
                <h1 className="adminTitle">Admin Details</h1>
                <button
                    className={`editButton ${isEditing ? "cancel" : "edit"}`}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Cancel" : "Edit Details"}
                </button>
            </div>

            <div className="adminContainer">
                {/* Left Info Card */}
                <div className="adminShow">
                    <div className="adminShowTop">
                        <img
                            src={admin.profileImage || "https://th.bing.com/th?id=OIP.EwG6x9w6RngqsKrPJYxULAHaHa&w=250&h=250"}
                            alt={admin.name}
                            className="adminShowImg"
                        />
                        <div className="adminShowTopTitle">
                            <span className="adminShowUsername">{admin.name}</span>
                            <span className="adminShowUserRole">{admin.role}</span>
                        </div>
                        <div>
                            <span className={`adminStatusTag ${admin.status}`}>
                                {admin.status}
                            </span>
                        </div>
                    </div>

                    <div className="adminShowBottom">
                        <h3 className="adminShowTitle">Account Info</h3>
                        <div className="adminShowInfo">
                            <MailOutline className="adminShowIcon" />
                            <span className="adminShowInfoTitle">{admin.email}</span>
                        </div>
                        {admin.phone && (
                            <div className="adminShowInfo">
                                <PhoneAndroid className="adminShowIcon" />
                                <span className="adminShowInfoTitle">{admin.phone}</span>
                            </div>
                        )}
                        <div className="adminShowInfo">
                            <Badge className="adminShowIcon" />
                            <span className="adminShowInfoTitle">Role: {admin.role}</span>
                        </div>
                        <div className="adminShowInfo">
                            <Timeline className="adminShowIcon" />
                            <span className="adminShowInfoTitle">Status: {admin.status}</span>
                        </div>
                        <div className="adminShowBottom">
                            <h3 className="adminShowTitle">Identity Verification</h3>
                            <div className="adminShowInfo">
                                <Badge className="adminShowIcon" />
                                <span className="adminShowInfoTitle">
                                    Type: {admin.identityType || "N/A"}
                                </span>
                            </div>
                            <div className="adminShowInfo">
                                <Badge className="adminShowIcon" />
                                <span className="adminShowInfoTitle">
                                    Number: {admin.identityNumber || "N/A"}
                                </span>
                            </div>
                            <div className="adminShowInfo">
                                <Badge className="adminShowIcon" />
                                <span className="adminShowInfoTitle">
                                    Verified: {admin.isVerified ? "Yes ✅" : "No ❌"}
                                </span>
                            </div>
                            <div className="adminShowInfo">
                                <PermIdentity className="adminShowIcon" />
                                <span className="adminShowInfoTitle">Gender: {admin.gender || "N/A"}</span>
                            </div>

                            <div className="adminShowInfo">
                                <CalendarToday className="adminShowIcon" />
                                <span className="adminShowInfoTitle">
                                    DOB: {admin.dob ? new Date(admin.dob).toLocaleDateString("en-GB") : "N/A"}
                                </span>
                            </div>

                            <div className="adminShowInfo">
                                <MailOutline className="adminShowIcon" />
                                <span className="adminShowInfoTitle">Address: {admin.address || "N/A"}</span>
                            </div>
                        </div>
                        <h3 className="adminShowTitle">Location Details</h3>

                        <div className="adminShowInfo">
                            <Badge className="adminShowIcon" />
                            <span className="adminShowInfoTitle">City: {admin.city || "N/A"}</span>
                        </div>

                        <div className="adminShowInfo">
                            <Badge className="adminShowIcon" />
                            <span className="adminShowInfoTitle">Branch: {admin.branch || "N/A"}</span>
                        </div>

                        <div className="adminShowInfo">
                            <Badge className="adminShowIcon" />
                            <span className="adminShowInfoTitle">State: {admin.state || "N/A"}</span>
                        </div>

                        <div className="adminShowInfo">
                            <Badge className="adminShowIcon" />
                            <span className="adminShowInfoTitle">Country: {admin.country || "N/A"}</span>
                        </div>
                        {admin.lastIp && (
                            <div className="adminShowInfo">
                                <Public className="adminShowIcon" />
                                <span className="adminShowInfoTitle">Last IP: {admin.lastIp}</span>
                            </div>
                        )}
                    </div>

                    <div className="adminShowBottom">
                        <h3 className="adminShowTitle">Activity & Dates</h3>
                        <div className="adminShowInfo">
                            <CalendarToday className="adminShowIcon" />
                            <span className="adminShowInfoTitle">
                                Created: {formatDate(admin.createdAt)}
                            </span>
                        </div>
                        <div className="adminShowInfo">
                            <CalendarToday className="adminShowIcon" />
                            <span className="adminShowInfoTitle">
                                Last Updated: {formatDate(admin.updatedAt)}
                            </span>
                        </div>
                        {admin.lastLoggedIn && (
                            <div className="adminShowInfo">
                                <Login className="adminShowIcon" />
                                <span className="adminShowInfoTitle">
                                    Last Logged In: {formatDate(admin.lastLoggedIn)}
                                </span>
                            </div>
                        )}
                        {admin.lastLoggedOut && (
                            <div className="adminShowInfo">
                                <Logout className="adminShowIcon" />
                                <span className="adminShowInfoTitle">
                                    Last Logged Out: {formatDate(admin.lastLoggedOut)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="adminShowBottom">
                        <h3 className="adminShowTitle">Security & Audit</h3>
                        <div className="adminShowInfo">
                            <Security className="adminShowIcon" />
                            <span className="adminShowInfoTitle">
                                Login Attempts: {admin.loginAttempts}
                            </span>
                        </div>
                        {admin.lockedUntil && (
                            <div className="adminShowInfo">
                                <Block className="adminShowIcon" />
                                <span className="adminShowInfoTitle">
                                    Locked Until: {formatDate(admin.lockedUntil)}
                                </span>
                            </div>
                        )}

                        {admin.createdBy && (
                            <div className="adminShowInfo">
                                <PersonAdd className="adminShowIcon" />
                                <span className="adminShowInfoTitle">
                                    <Link
                                        to={`/admin/${admin.createdBy._id}`}
                                        state={{ adminId: admin.createdBy._id }}
                                        className='link'
                                    >
                                        Created By: {admin.createdBy.name} ({admin.createdBy.email})
                                    </Link>
                                </span>

                                {/* <button className="viewAdminButton">View</button> */}
                            </div>
                        )}
                        {admin.updatedBy && (
                            <div className="adminShowInfo">
                                <PersonOutline className="adminShowIcon" />
                                <span className="adminShowInfoTitle">
                                    <Link
                                        to={`/admin/${admin.updatedBy._id}`}
                                        state={{ adminId: admin.updatedBy._id }}
                                        className='link'
                                    >
                                        Last Updated By: {admin.updatedBy.name} ({admin.updatedBy.email})
                                    </Link>
                                </span>
                                {/* <button className="viewAdminButton">View</button> */}
                            </div>
                        )}
                    </div>
                    <div className="driverApprovalHistory">
                        <h3 className="driverInfoTitle">Logs</h3>
                        <div className="driverInfoItem">
                            <span className="driverInfoLabel">Created On:</span>
                            <span className="driverInfoText">
                                {new Date(admin.createdAt).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}
                            </span>
                        </div>
                        <div className="driverInfoItem">
                            <span className="driverInfoLabel">Updated On:</span>
                            <span className="driverInfoText">
                                {new Date(admin.updatedAt).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}
                            </span>
                        </div>
                        {approvalHistory.length > 0 && (
                            <div>

                                {/* ✅ Latest Action */}
                                <div className="driverInfoItem">
                                    <span className="driverInfoLabel">Last Action By:</span>
                                    <span className="driverInfoText">
                                        <Link
                                            to={`/admin/${approvalHistory[0].actionBy._id}`}
                                            state={{ adminId: approvalHistory[0].actionBy._id }}
                                            className="link"
                                        >
                                            {approvalHistory[0].actionBy?.name} ({approvalHistory[0].actionBy?.role})
                                            {/* 👇 Styled button-like link */}
                                            {/* 👤 View Admin */}
                                        </Link>
                                    </span>
                                </div>

                                <div className="driverInfoItem">
                                    <span className="driverInfoLabel">Last Action On:</span>
                                    <span className="driverInfoText">
                                        {new Date(approvalHistory[0].actionOn).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </span>
                                </div>

                                <div className="driverInfoItem">
                                    <span className="driverInfoLabel">Last Action: </span>
                                    <span className="driverInfoText">{approvalHistory[0].action}</span>
                                </div>

                                <div className="driverInfoItem">
                                    <span className="driverInfoLabel">Remarks: </span>
                                    <span className="driverInfoText">{approvalHistory[0].remark}</span>
                                </div>

                                {/* ✅ Full History Button */}
                                <button
                                    className="viewFullHistoryButton"
                                    onClick={() => setShowHistoryModal(true)}
                                >
                                    📜 View Full History
                                </button>
                            </div>
                        )}

                    </div>
                </div>

                {/* ✅ Full History Modal */}
                {showHistoryModal && (
                    <div className="modalOverlay">
                        <div className="modalContent">
                            <h3>Full Audit & Logs</h3>
                            <button
                                className="closeModalButton"
                                onClick={() => setShowHistoryModal(false)}
                            >
                                ✖ Close
                            </button>
                            <ul className="historyList">
                                {approvalHistory.map((h) => (
                                    <li key={h._id} className="historyItem">
                                        <p>
                                            <strong>Action: </strong> {h.action}
                                        </p>
                                        <p>
                                            <strong>By: </strong> {h.actionBy?.name} ({h.actionBy?.role})
                                            <Link
                                                to={`/admin/${h.actionBy?._id}`}
                                                state={{ adminId: h.actionBy?._id }}
                                                className="viewAdminButton"
                                            >
                                                👤 View Admin
                                            </Link>
                                        </p>
                                        <p>
                                            <strong>On: </strong>{" "}
                                            {new Date(h.actionOn).toLocaleString("en-GB")}
                                        </p>
                                        <p>
                                            <strong>Remarks: </strong> {h.remark ? h.remark : "—"}
                                        </p>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </div>
                )}



                {/* Right Actions and Edit Card */}
                <div className="adminActionsCard">
                    <h3 className="adminActionsTitle">Actions</h3>

                    <button
                        className={`adminActionButton ${admin.status === "active" ? "deactivate" : "activate"}`}
                        onClick={handleApproval}
                    >
                        {admin.status === "active" ? "Deactivate Admin" : "Activate Admin"}
                    </button>

                    <button
                        className="adminActionButton delete"
                        onClick={() => handleDelete(admin._id)}
                    >
                        Delete Admin
                    </button>

                    <h3 className="adminActionsTitle updateTitle">Update Admin Details</h3>
                    <form className="adminUpdateForm" onSubmit={handleUpdate}>
                        <div className="adminUpdateItem">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={updatedAdmin.name}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="adminUpdateItem">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={updatedAdmin.email}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="adminUpdateItem">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={updatedAdmin.phone}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="adminUpdateItem">
                            <label>Role</label>
                            <select
                                name="role"
                                value={updatedAdmin.role}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            >
                                <option value="Moderator">Moderator</option>
                                <option value="Admin">Admin</option>
                                <option value="SuperAdmin">Super Admin</option>
                            </select>
                        </div>

                        <div className="adminUpdateItem">
                            <label>Status</label>
                            <select
                                name="status"
                                value={updatedAdmin.status}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="adminUpdateItem">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={updatedAdmin.gender}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="adminUpdateItem">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={
                                    updatedAdmin.dob
                                        ? new Date(updatedAdmin.dob).toISOString().split("T")[0]
                                        : ""
                                }
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="adminUpdateItem">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={updatedAdmin.address}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="adminUpdateItem">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={updatedAdmin.city}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="adminUpdateItem">
                            <label>Branch</label>
                            <input
                                type="text"
                                name="branch"
                                value={updatedAdmin.branch}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="adminUpdateItem">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                value={updatedAdmin.state}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="adminUpdateItem">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={updatedAdmin.country}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="adminUpdateItem">
                            <label>Identity Type</label>
                            <select
                                name="identityType"
                                value={updatedAdmin.identityType}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            >
                                <option value="Aadhar">Aadhar</option>
                                <option value="PAN">PAN</option>
                                <option value="Passport">Passport</option>
                                <option value="Driving License">Driving License</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="adminUpdateItem">
                            <label>Identity Number</label>
                            <input
                                type="text"
                                name="identityNumber"
                                value={updatedAdmin.identityNumber}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="adminUpdateItem">
                            <label>Verified</label>
                            <select
                                name="isVerified"
                                value={updatedAdmin.isVerified}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            >
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </div>

                        <div className="adminUpdateItem">
                            <label>Profile Image URL</label>
                            <input
                                type="text"
                                name="profileImage"
                                value={updatedAdmin.profileImage}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="adminUpdateItem">
                            <label>Password (leave blank if unchanged)</label>
                            <input
                                type="password"
                                name="password"
                                value={updatedAdmin.password || ""}
                                onChange={handleChange}
                                className="adminUpdateInput"
                                disabled={!isEditing}
                            />
                        </div>

                        {isEditing && (
                            <button type="submit" className="adminUpdateButton">
                                Update
                            </button>
                        )}
                    </form>


                </div>
            </div>
        </div>
    );
}