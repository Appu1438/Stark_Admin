import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  Publish,
  Remove
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./user.css";
import { useContext, useState } from 'react';
import storage from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateUser } from '../../context/userContext/apiCalls';
import { UserContext } from '../../context/userContext/UserContext';

export default function User() {

  const location = useLocation()
  const navigate = useNavigate()
  const user = location.state.user

  const { dispatch } = useContext(UserContext)

  const { createdAt, updatedAt, password, ...restOfUser } = user;
  const [userData, setUserData] = useState(restOfUser);
  const [uploadProgress, setUploadProgress] = useState(0); // New state for tracking upload progress


  const handleChange = (e) => {
    const value = e.target.value
    setUserData({ ...userData, [e.target.name]: value })
  }

  const handleRemoveProfilePic = () => {
    setUserData((prevData) => ({
      ...prevData,
      profilePic: null,
    }));
  };

  const handleProfileChange = (e) => {
    const image = e.target.files[0];
    if (!image) return; // Early return if no image is selected

    const filename = new Date().getTime() + image.name;
    const storageRef = ref(storage, `items/${filename}`);

    // Upload the file with resumable upload
    const uploadTask = uploadBytesResumable(storageRef, image);

    // Monitor the upload progress
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Calculate the progress as a percentage
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        setUploadProgress(progress); // Update progress state

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Upload failed:', error);
        setUploadProgress(0); // Reset progress after successful upload

      },
      () => {
        // Handle successful uploads on completion
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          // Assuming profilePic is the correct key in userData
          setUserData((prev) => ({ ...prev, profilePic: downloadURL }));
          setUploadProgress(0); // Reset progress after successful upload

        });
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUser(userData, dispatch, navigate)

  }
  console.log(userData);

  return (

    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to="/newUser">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={userData.profilePic ?userData.profilePic  : "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{userData.username}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle"> Created On: {new Date(user.createdAt).getDate()}/
                {new Date(user.createdAt).getMonth() + 1}/
                {new Date(user.createdAt).getFullYear()}
              </span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              <span className="userShowInfoTitle">Updated On: {new Date(user.updatedAt).getDate()}/
                {new Date(user.updatedAt).getMonth() + 1}/
                {new Date(user.updatedAt).getFullYear()}
              </span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">{userData.email}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  name='username'
                  placeholder={userData.username}
                  value={userData.username}
                  className="userUpdateInput"
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  name='email'
                  placeholder={userData.email}
                  className="userUpdateInput"
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>
              {/* <div className="userUpdateItem">
                <label>Password</label>
                <input
                  type="text"
                  name='password'
                  placeholder="username@1234"
                  className="userUpdateInput"
                  onChange={handleChange}
                />
              </div> */}
              <div className="userUpdateItem">
                <label>Is Admin?</label>
                <select value={userData.isAdmin.toString()} name="isAdmin" id="isAdmin" onChange={handleChange}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>


            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src={userData.profilePic ?userData.profilePic  : "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                  alt=""
                />
                <label htmlFor="file">
                  <Publish className="userUpdateIcon" />
                </label>
                <label htmlFor="" onClick={handleRemoveProfilePic}>
                  <Remove className="userUpdateIcon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} onChange={handleProfileChange} />
              </div>
              {uploadProgress > 0 && (
                <div className="progressBarContainer">
                  <progress value={uploadProgress} max="100"></progress>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
              )}
              <button className="userUpdateButton" onClick={handleSubmit}>Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}