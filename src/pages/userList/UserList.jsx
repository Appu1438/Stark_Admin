import "./userList.css";
import { useContext, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext/UserContext";
import { getUsers } from "../../context/userContext/apiCalls";
import Spinner from "../../components/spinner/Spinner";
import Chart from "../../components/chart/Chart";
import DataTable from "../../components/dataTable/DataTable";
import useUserStats from "../../hooks/stats/user/getUserStats";

export default function UserList() {
  const { users, dispatch } = useContext(UserContext);
  const { userStats, loading } = useUserStats();
  const navigate = useNavigate();

  // ✅ Fetch users
  useEffect(() => {
    getUsers(dispatch);
  }, [dispatch]);

  // ✅ Define columns for the table
  const columns = useMemo(
    () => [
      {
        Header: "Profile",
        accessor: "profilePic",
        Cell: ({ row }) => (
          <img
            src={
              row.original.profilePic ||
              "https://th.bing.com/th?id=OIP.EwG6x9w6RngqsKrPJYxULAHaHa"
            }
            alt={row.original.name || "User"}
            className="tableImg"
          />
        ),
      },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "phone_number" },
      { Header: "Total Rides", accessor: "totalRides" },
      {
        Header: "Ratings",
        accessor: "ratings",
        Cell: ({ value }) => (value ? `⭐ ${value.toFixed(1)}` : "N/A"),
      },
    ],
    []
  );

  return (
    <div className="userList">
      <h2 className="pageTitle">Users</h2>
      <Chart data={userStats} title="User Analytics" grid dataKey="New User" />

      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          title="Users"
          data={users}
          columns={columns}
          showCreate={false}
          searchPlaceholder="Search users by name, email, or phone..."
          buttonName={"View"}
          filterOptions={[]} // No filters
          onButtonClick={(user) =>
            navigate(`/user/${user._id}`, { state: { userId: user._id } })
          }
        />
      )}
    </div>
  );
}
