import "./adminList.css";
import { Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState, useMemo } from "react";
import Spinner from "../../components/spinner/Spinner";
import { AdminContext } from "../../context/adminContext/AdminContext";
import { getAdmins } from "../../context/adminContext/apiCalls";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext/AuthContext";
import {
  useTable,
  useSortBy,
  usePagination,
} from "react-table";

export default function AdminList() {
  const { admins, dispatch } = useContext(AdminContext);
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(""); // role/status filter

  useEffect(() => {
    getAdmins(dispatch, toast);
  }, [dispatch]);

  // 🔍 Filtered admins (memoized to avoid infinite re-renders)
  const filteredAdmins = useMemo(() => {
    let result = admins || [];

    // ✅ Apply search filter
    if (search) {
      result = result.filter((user) =>
        [user.name, user.email, user.phone_number, user.city, user.branch, user.address, user.state, user.identityNumber, user.identityType, user.gender]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // ✅ Apply role/status filter
    if (filter) {
      result = result.filter(
        (user) =>
          user.role?.toLowerCase() === filter.toLowerCase() ||
          user.status?.toLowerCase() === filter.toLowerCase()
      );
    }

    return result;
  }, [admins, search, filter]);


  // ✅ Memoize columns
  const columns = useMemo(
    () => [
      {
        Header: "Profile",
        accessor: "profileImage",
        Cell: ({ value }) => (
          <img
            src={
              value && value.trim() !== ""
                ? value
                : "https://th.bing.com/th?id=OIP.EwG6x9w6RngqsKrPJYxULAHaHa"

            }
            alt="profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ),
      },

      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Role", accessor: "role" },
      { Header: "Status", accessor: "status" },
      { Header: "Phone", accessor: "phone" },
      {
        Header: "Last Login",
        accessor: "lastLoggedIn",
        Cell: ({ value }) =>
          value
            ? new Date(value).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            : "—",
      },
      {
        Header: "Last Logout",
        accessor: "lastLoggedOut",
        Cell: ({ value }) =>
          value
            ? new Date(value).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            : "—",
      },
      {
        Header: "Actions",
        accessor: "_id",
        Cell: ({ row }) => (
          <div className="adminAction">
            <Link
              to={`/admin/${row.original._id}`}
              state={{ adminId: row.original._id }}
            >
              <button className="adminEdit">Edit</button>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  // ✅ Table hook with stable data
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
      data: filteredAdmins,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="adminList">
      <div className="adminTitleContainer">
        <h2 className="pageTitle">Admins</h2>
        {user?.role === "SuperAdmin" && (
          <Link to="/newAdmin">
            <button className="adminAddButton">Create</button>
          </Link>
        )}
      </div>

      {/* Search + Filter Row */}
      <div className="searchFilterRow">
        {/* 🔍 Search Bar */}
        <div className="searchBar">
          <Search className="searchIcon" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 🎛️ Filter Dropdown */}
        <div className="filterBar">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Deleted">Deleted</option>
          </select>
        </div>
      </div>


      {admins?.length === 0 ? (
        <Spinner />
      ) : filteredAdmins.length > 0 ? (
        <>
          <table {...getTableProps()} className="adminTable">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      key={column.id}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
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
                  <tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td key={cell.column.id} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ✅ Pagination */}
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
        <div className="noAdmins">
          <span>🚫</span>
          No admins found matching your search.
        </div>
      )}
    </div>
  );
}
