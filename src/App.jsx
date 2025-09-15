import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/adminNew/NewAdmin";
import Driver from "./pages/driver/Driver";
import Login from "./pages/login/Login";
import { useContext, useState } from "react";
import { AuthContext } from "./context/authContext/AuthContext";
import { useEffect } from "react";
import AdminList from "./pages/adminList/AdminList";
import Admin from "./pages/admin/Admin";
import NewAdmin from "./pages/adminNew/NewAdmin";
import ApprovedDriverList from "./pages/driverList/Approved-DriverList";
import NonApprovedDriverList from "./pages/driverList/Non-Approved-DriverList";
import "react-toastify/dist/ReactToastify.css";
import Map from "./pages/map/Map";
import Profile from "./pages/profile/Profile";


function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
      <div className="container">
        <Sidebar
          className={sidebarOpen ? "sidebar open" : "sidebar"}
          onMenuClick={() => setSidebarOpen(false)} // close when menu item clicked
        />
        <Outlet />
      </div>
    </>
  );
}

function App() {
  // ... (Your existing App component code)
  useEffect(() => {
    console.log('API URL:', process.env.REACT_APP_API_URL);
    console.log('API URL DRIVER:', process.env.REACT_APP_API_URL_DRIVER);
    console.log('REACT_APP_SOCKET_URL:', process.env.REACT_APP_SOCKET_URL);
    console.log('REACT_APP_GOOGLE_CLOUD_API_KEY:', process.env.REACT_APP_GOOGLE_CLOUD_API_KEY);
    console.log('REACT_APP_GOOGLE_MAP_ID:', process.env.REACT_APP_GOOGLE_MAP_ID);
  }, [])
  const { user } = useContext(AuthContext)
  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={'/'} /> : <Login />} />
        {user ? (
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/user/:userId" element={<User />} />
            <Route path="/newUser" element={<NewUser />} />
            <Route path="/approved-drivers" element={<ApprovedDriverList />} />
            <Route path="/non-approved-drivers" element={<NonApprovedDriverList />} />
            <Route path="/driver/:driverId" element={<Driver />} />
            <Route path="/admins" element={<AdminList />} />
            <Route path="/admin/:adminId" element={<Admin />} />
            <Route path="/newAdmin" element={<NewAdmin />} />
            <Route path="/map" element={<Map />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;