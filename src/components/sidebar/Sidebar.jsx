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
  List
} from '@mui/icons-material';
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("home");

  const handleMenuClick = (path) => {
    setActiveMenu(path);
  };

  return (
    <div className="sidebar">
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
            <li
              className={`sidebarListItem ${activeMenu === "sales" ? "active" : ""}`}
              onClick={() => handleMenuClick("sales")}
            >
              <TrendingUp className="sidebarIcon" />
              Sales
            </li>
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
            <Link to="/movies" className="link">
              <li
                className={`sidebarListItem ${activeMenu === "movies" ? "active" : ""}`}
                onClick={() => handleMenuClick("movies")}
              >
                <PlayCircleOutline className="sidebarIcon" />
                Movies
              </li>
            </Link>
            <Link to="/lists" className="link">

              <li
                className={`sidebarListItem ${activeMenu === "list" ? "active" : ""}`}
                onClick={() => handleMenuClick("list")}
              >
                <List className="sidebarIcon" />
                Lists
              </li>
            </Link>

            <li
              className={`sidebarListItem ${activeMenu === "reports" ? "active" : ""}`}
              onClick={() => handleMenuClick("reports")}
            >
              <BarChart className="sidebarIcon" />
              Reports
            </li>
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
