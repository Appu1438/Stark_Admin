import "./widgetSm.css";
import { Visibility } from '@mui/icons-material';
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

export default function WidgetSm() {

  const [newUsers, setNewUsers] = useState([])

  useEffect(() => {
    const getNewUsers = async () => {
      try {
        const res = await axiosInstance.get(`users/?new=true`)
        setNewUsers(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getNewUsers()
  }, [])
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {newUsers.map((user) => (

          <li className="widgetSmListItem">
            <img
              src={user.profilePic || 'https://th.bing.com/th?id=OIP.EwG6x9w6RngqsKrPJYxULAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&cb=13&dpr=1.3&pid=3.1&rm=2'}
              alt=""
              className="widgetSmImg"
            />
            <div className="widgetSmUser">
            <span className="widgetSmUsername">{user.username}</span>
            <span className="widgetSmUserTitle">{user.email}</span>
            </div>
            <button className="widgetSmButton">
              <Visibility className="widgetSmIcon" />
              Display
            </button>
          </li>
        ))}

      </ul>
    </div>
  );
}