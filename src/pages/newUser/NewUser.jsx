import { useState } from "react";
import "./newUser.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { createUser } from "../../context/userContext/apiCalls";
import { UserContext } from "../../context/userContext/UserContext";
import { useContext } from "react";
export default function NewUser() {

  const navigate = useNavigate()
  const { dispatch } = useContext(UserContext)
  const [userData, setUserData] = useState();


  const handleChange = (e) => {
    const value = e.target.value
    setUserData({ ...userData, [e.target.name]: value })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    createUser(userData, dispatch, navigate)
  }
  console.log(userData);

  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
      <form className="newUserForm">
        <div className="newUserItem">
          <label>Username</label>
          <input type="text" placeholder="john" name="username" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Email</label>
          <input type="email" placeholder="john@gmail.com" name="email" onChange={handleChange} />
        </div>
        <div className="newUserItem " >
          <label>Password</label>
          <input type="text" placeholder="password" name="password" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>is Admin</label>
          <select className="newUserSelect" name="isAdmin" id="isAdmin" onChange={handleChange}>
            <option value="">Is Admin</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button className="newUserButton" onClick={handleSubmit}>Create</button>
      </form>
    </div>
  );
}