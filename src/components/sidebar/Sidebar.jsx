import "./sidebar.css";
import {
  LineStyle,
  Timeline,
  TrendingUp,
  PermIdentity,
  Storefront,
  AttachMoney,
  BarChart,
  MailOutline,
  DynamicFeed,
  ChatBubbleOutline,
  WorkOutline,
  Report,
  PlayCircleOutline,
  List,
  CarRental,
  AddModerator,
  AdminPanelSettings,
  AdminPanelSettingsRounded,
  CarCrashSharp,
  AdminPanelSettingsSharp,
  MapRounded,
  MapSharp,
  MapOutlined
} from '@mui/icons-material';
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { FaUser } from "react-icons/fa";

// Accept 'className' as a prop
export default function Sidebar({ className, onMenuClick }) {
  const [activeMenu, setActiveMenu] = useState(localStorage.getItem("activeMenu"));

  const handleMenuClick = (path) => {
    localStorage.setItem("activeMenu", path);
    setActiveMenu(path);
    if (onMenuClick) onMenuClick(); // ✅ closes sidebar
  };

  return (
    // Apply the className prop to the sidebar div
    <div className={className}>
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
              <li
                className={`sidebarListItem ${activeMenu === "home" ? "active" : ""}`}
                onClick={() => handleMenuClick("home")}
              >
                <LineStyle className="sidebarIcon" />
                Home
              </li>
            </Link>
            <li
              className={`sidebarListItem ${activeMenu === "analytics" ? "active" : ""}`}
              onClick={() => handleMenuClick("analytics")}
            >
              <Timeline className="sidebarIcon" />
              Analytics
            </li>
            <Link to="/profile" className="link">

              <li
                className={`sidebarListItem ${activeMenu === "profile" ? "active" : ""}`}
                onClick={() => handleMenuClick("profile")}
              >
                <PermIdentity className="sidebarIcon" />
                Profile
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li
                className={`sidebarListItem ${activeMenu === "users" ? "active" : ""}`}
                onClick={() => handleMenuClick("users")}
              >
                <PermIdentity className="sidebarIcon" />
                Users
              </li>
            </Link>
            <Link to="/approved-drivers" className="link">
              <li
                className={`sidebarListItem ${activeMenu === "approved-drivers" ? "active" : ""}`}
                onClick={() => handleMenuClick("approved-drivers")}
              >
                <CarRental className="sidebarIcon" />
                Approved Drivers
              </li>
            </Link>
            <Link to="/non-approved-drivers" className="link">
              <li
                className={`sidebarListItem ${activeMenu === "non-approved-drivers" ? "active" : ""}`}
                onClick={() => handleMenuClick("non-approved-drivers")}
              >
                <CarRental className="sidebarIcon" />
                Non-Approved
              </li>
            </Link>

            <Link to="/admins" className="link">

              <li
                className={`sidebarListItem ${activeMenu === "admins" ? "active" : ""}`}
                onClick={() => handleMenuClick("admins")}
              >
                <AdminPanelSettingsSharp className="sidebarIcon" />
                Admins
              </li>
            </Link>

            <Link to="/map" className="link">

              <li
                className={`sidebarListItem ${activeMenu === "maps" ? "active" : ""}`}
                onClick={() => handleMenuClick("maps")}
              >
                <MapOutlined className="sidebarIcon" />
                Maps
              </li>
            </Link>

          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <li
              className={`sidebarListItem ${activeMenu === "mail" ? "active" : ""}`}
              onClick={() => handleMenuClick("mail")}
            >
              <MailOutline className="sidebarIcon" />
              Mail
            </li>
            <li
              className={`sidebarListItem ${activeMenu === "feedback" ? "active" : ""}`}
              onClick={() => handleMenuClick("feedback")}
            >
              <DynamicFeed className="sidebarIcon" />
              Feedback
            </li>
            <li
              className={`sidebarListItem ${activeMenu === "messages" ? "active" : ""}`}
              onClick={() => handleMenuClick("messages")}
            >
              <ChatBubbleOutline className="sidebarIcon" />
              Messages
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <li
              className={`sidebarListItem ${activeMenu === "manage" ? "active" : ""}`}
              onClick={() => handleMenuClick("manage")}
            >
              <WorkOutline className="sidebarIcon" />
              Manage
            </li>
            <li
              className={`sidebarListItem ${activeMenu === "analytics" ? "active" : ""}`}
              onClick={() => handleMenuClick("analytics")}
            >
              <Timeline className="sidebarIcon" />
              Analytics
            </li>
            <li
              className={`sidebarListItem ${activeMenu === "reports" ? "active" : ""}`}
              onClick={() => handleMenuClick("reports")}
            >
              <Report className="sidebarIcon" />
              Reports
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}