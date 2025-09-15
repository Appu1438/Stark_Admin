import {
  CalendarToday,
  MailOutline,
  PermIdentity,
  Phone,
  Publish,
  Remove
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./user.css";
import { useContext, useEffect, useState } from 'react';
import { getUsers, updateUser } from '../../context/userContext/apiCalls';
import { UserContext } from '../../context/userContext/UserContext';

export default function User() {

  const location = useLocation()
  const navigate = useNavigate()
  const userId = location.state.userId

  const { users, dispatch } = useContext(UserContext)
  const user = users?.find((u) => u._id === userId)

  const [userData, setUserData] = useState(user);

  useEffect(() => {
    getUsers(dispatch);
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUser(userData, dispatch, navigate)
  }

  // Handle cases where the user data might not be found
  if (!user) {
    return (
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">User Not Found</h1>
          {/* <Link to="/newUser">
            <button className="userAddButton">Create New User</button>
          </Link> */}
        </div>
        <div className="userContainer" style={{ justifyContent: 'center', textAlign: 'center', marginTop: '50px' }}>
          <p style={{ color: '#888', fontSize: '18px' }}>The user you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">User Details</h1>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={user.profilePic ? user.profilePic : "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user?.name}</span>
              <span className="userShowUserTitle">User</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">
                Created On: {new Date(user?.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              <span className="userShowInfoTitle">
                Updated On: {new Date(user?.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">{user?.email}</span>
            </div>
            <div className="userShowInfo">
              <Phone className="userShowIcon" />
              <span className="userShowInfoTitle">{user?.phone_number}</span>
            </div>
            <span className="userShowTitle">Additional Info</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">Total Rides: {user?.totalRides}</span>
            </div>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">Rating: {user?.ratings}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm" onSubmit={handleSubmit}>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Name</label>
                <input
                  type="text"
                  name='name'
                  placeholder={user?.name}
                  value={userData?.name || ''}
                  className="userUpdateInput"
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  name='email'
                  placeholder={user?.email}
                  className="userUpdateInput"
                  value={userData?.email || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Phone Number</label>
                <input
                  type="text"
                  name='phone_number'
                  placeholder={user?.phone_number}
                  className="userUpdateInput"
                  value={userData?.phone_number || ''}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="userUpdateButton">Update</button>

            </div>
            <div className="userUpdateRight">
              {/* <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src={user?.profilePic || "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                  alt=""
                />
              </div> */}
              {/* <button type="submit" className="userUpdateButton">Update</button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}