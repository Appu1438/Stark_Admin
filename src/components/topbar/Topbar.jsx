import React, { useContext } from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from '@mui/icons-material';
import { AuthContext } from '../../context/authContext/AuthContext'
import { logout } from "../../context/authContext/apiCalls";
export default function Topbar() {

  const { user, dispatch } = useContext(AuthContext)
  const handleLogout = async () => {
    logout()
  }
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">CINEFLIX ADMIN</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
            <div className="options">
              <span>Profile</span>
              <span onClick={handleLogout}>Logout</span>
            </div>
          </div>
          <img src={user.profilePic || "https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"} alt="" className="topAvatar" />
        </div>
      </div>
    </div>
  );
}