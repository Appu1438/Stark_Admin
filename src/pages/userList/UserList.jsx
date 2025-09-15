import "./userList.css";
import { DeleteOutline, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { UserContext } from "../../context/userContext/UserContext";
import { deleteUser, getUsers } from "../../context/userContext/apiCalls";
import Spinner from "../../components/spinner/Spinner";
import Chart from "../../components/chart/Chart";
import axiosInstance from "../../api/axiosInstance";
import useStats from "../../hooks/stats/useStats";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function UserList() {
  const { users, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(""); // role/status filter


  // ✅ Fetch users
  useEffect(() => {
    getUsers(dispatch);
  }, [dispatch]);

  // ✅ Fetch user stats once
  const { userStats, driverStats, loading } = useStats();


  // ✅ Filter users
  const filteredUsers = useMemo(() => (
    users?.filter((user) =>
      [user.name, user.email, user.phone_number]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(search.toLowerCase()))
    ) || []
  ), [users, search]);

  // ✅ Columns (memoized)
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
      {
        Header: "Actions",
        accessor: "_id",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="tableActions">
            <Link to={`/user/${row.original._id}`} state={{ userId: row.original._id }}>
              <button className="userListEdit">Edit</button>
            </Link>
          </div>
        ),
      },
    ],
    [dispatch]
  );
  // ✅ Table setup
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, pageSize },
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: filteredUsers,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  // ... (imports and component logic)

  return (
    <div className="userList">
      <h2 className="pageTitle">Users</h2>
      <Chart data={userStats} title="User Analytics" grid dataKey="New User" />

      {/* Search Bar */}
      <div className="searchBar">
        <Search className="searchIcon" />
        <input
          type="text"
          placeholder="Search users by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {users?.length === 0 ? (
        <Spinner />
      ) : filteredUsers.length > 0 ? (
        <>
          {/* ✅ Add the tableWrapper here */}
          <div className="tableWrapper">
            <table {...getTableProps()} className="userTable">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination Controls */}
          <div className="pagination">
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Prev
            </button>
            <span>
              Page {pageIndex + 1} of {pageOptions.length}
            </span>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </button>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <div className="noUsers">
          <span>🚫</span>
          No users found matching your search.
        </div>
      )}
    </div>
  );
}