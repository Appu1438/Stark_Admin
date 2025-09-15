import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import "./profile.css";
import {
    Email,
    Phone,
    LocationCity,
    Public,
    Lock,
    CalendarToday,
    Badge,
    Home,
    AssignmentInd,
    ExitToApp, // New icon for logout
} from "@mui/icons-material";
import { logout } from "../../context/authContext/apiCalls";

export default function Profile() {
    const { user, dispatch } = useContext(AuthContext);

    const handleLogout = () => {
        // Dispatch a logout action
        logout(user)
        // Redirect or perform other cleanup
        // For example, redirect to the login page
        // window.location.href = "/login";
    };

    if (!user) {
        return (
            <div className="profile flex-4">
                <h2 className="profileTitle">Admin Profile</h2>
                <p className="noUser">No admin data available.</p>
            </div>
        );
    }

    return (
        <div className="profile flex-4">
            <div className="profileHeaderContainer">
                <h2 className="profileTitle">Admin Profile</h2>
                <button onClick={handleLogout} className="logoutButton">
                    <ExitToApp />
                    <span>Logout</span>
                </button>
            </div>

            {/* Profile Card */}
            <div className="profileCard">
                <div className="profileMainHeader">
                    <img
                        src={
                            user.profileImage ||
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="Admin"
                        className="profileImg"
                    />
                    <div className="profileInfo">
                        <h3>{user.name}</h3>
                        <span className={`roleBadge role-${user.role?.toLowerCase()}`}>
                            {user.role}
                        </span>
                        <span className={`statusBadge ${user.status}`}>
                            {user.status?.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="profileDetails">
                    <div className="detailItem">
                        <Email className="detailIcon" /> {user.email}
                    </div>
                    <div className="detailItem">
                        <Phone className="detailIcon" /> {user.phone || "N/A"}
                    </div>
                    <div className="detailItem">
                        <AssignmentInd className="detailIcon" /> ID: {user.identityType} -{" "}
                        {user.identityNumber || "N/A"}
                    </div>
                    <div className="detailItem">
                        <Home className="detailIcon" /> {user.address || "N/A"}
                    </div>
                    <div className="detailItem">
                        <LocationCity className="detailIcon" /> {user.city || "N/A"},{" "}
                        {user.state || "N/A"}
                    </div>
                    <div className="detailItem">
                        <LocationCity className="detailIcon" />
                        Branch : {user.branch || "N/A"}
                    </div>
                    <div className="detailItem">
                        <Public className="detailIcon" /> {user.country || "India"}
                    </div>
                    <div className="detailItem">
                        <CalendarToday className="detailIcon" /> DOB:{" "}
                        {user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : "N/A"}
                    </div>
                    <div className="detailItem">
                        <Badge className="detailIcon" /> Gender: {user.gender || "N/A"}
                    </div>
                    <div className="detailItem">
                        <Lock className="detailIcon" /> Last Login:{" "}
                        {user.lastLoggedIn
                            ? new Date(user.lastLoggedIn).toLocaleDateString('en-GB')
                            : "N/A"}
                    </div>
                    <div className="detailItem">
                        <Lock className="detailIcon" /> Created On:{" "}
                        {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('en-GB')
                            : "N/A"}
                    </div>
                    <div className="detailItem">
                        <Lock className="detailIcon" /> Updated On:{" "}
                        {user.updatedAt
                            ? new Date(user.updatedAt).toLocaleDateString('en-GB')
                            : "N/A"}
                    </div>
                </div>
            </div>
        </div>
    );
}