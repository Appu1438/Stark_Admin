import "./userList.css";
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext/UserContext";
import { deleteUser, getUsers } from "../../context/userContext/apiCalls";
import Spinner from "../../components/spinner/Spinner";

export default function UserList() {

  const { users, dispatch } = useContext(UserContext)

  const handleDelete = (id) => {
    deleteUser(id, dispatch)
  };

  useEffect(() => {
    getUsers(dispatch)
  }, [dispatch])

  console.log(users);


  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    {
      field: "user",
      headerName: "User",
      width: 250,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.profilePic || 'https://th.bing.com/th?id=OIP.EwG6x9w6RngqsKrPJYxULAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&cb=13&dpr=1.3&pid=3.1&rm=2'} alt="" />
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "isAdmin",
      headerName: "Is Admin",
      width: 120,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row._id}  state={{ user: params.row }}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
       {users.length > 0 ? (
        <DataGrid
          rows={users}
          disableSelectionOnClick
          columns={columns}
          pageSize={8}
          checkboxSelection
          getRowId={(r) => r._id}
        />
      ) : (
        <Spinner/>
      )}
    </div>
  );
}