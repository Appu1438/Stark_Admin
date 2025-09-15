import React, { useContext } from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings, Menu, Close } from "@mui/icons-material";
import { AuthContext } from "../../context/authContext/AuthContext";
import { logout } from "../../context/authContext/apiCalls";
import { Link } from "react-router-dom";

export default function Topbar({ sidebarOpen, onToggleSidebar }) {
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    logout(user);
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">

          <span className="logo">STARK ADMIN</span>
        </div>

        <div className="topRight">
          {/* Show Menu OR Close icon depending on sidebar state */}
          {sidebarOpen ? (
            <Close className="hamburger" onClick={onToggleSidebar} />
          ) : (
            <Menu className="hamburger" onClick={onToggleSidebar} />
          )}
          {/* <div className="topbarIconContainer">
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
              <Link className="link" to={'/profile'}>
                <span>Profile</span>
              </Link>
              <span onClick={handleLogout}>Logout</span>
            </div>
          </div>
          <img
            src={
              user?.profilePic ||
              "https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            }
            alt="profile"
            className="topAvatar"
          /> */}
        </div>
      </div>
    </div>
  );
}
