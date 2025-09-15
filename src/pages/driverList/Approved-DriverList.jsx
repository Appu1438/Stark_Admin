import "./driverList.css";
import { DeleteOutline, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import Spinner from "../../components/spinner/Spinner";
import Chart from "../../components/chart/Chart";
import { DriverContext } from "../../context/driverContext/DriverContext";
import { getDrivers } from "../../context/driverContext/apiCalls";
import { toast } from "react-toastify";

// 🔑 react-table imports
import { useTable, usePagination, useSortBy } from "react-table";
import axiosInstance from "../../api/axiosInstance";
import useStats from "../../hooks/stats/useStats";

export default function ApprovedDriverList() {
  const { drivers, dispatch } = useContext(DriverContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");


  useEffect(() => {
    getDrivers(dispatch, toast);
  }, [dispatch]);

  const { userStats, driverStats, loading } = useStats();

  // ✅ Only approved + search filter
  const filteredDrivers = useMemo(() => {
    const now = new Date();

    return drivers
      ?.filter((driver) => driver.is_approved)
      .filter((driver) => {
        // 🔍 Search logic
        const matchesSearch = Object.values({
          name: driver.name,
          email: driver.email,
          phone: driver.phone_number,
          country: driver.country,
          vehicle_type: driver.vehicle_type,
          registration_number: driver.registration_number,
          vehicle_color: driver.vehicle_color,
          capacity: driver.capacity,
          status: driver.status,
        })
          .filter(Boolean)
          .some((field) =>
            field.toString().toLowerCase().includes(search.toLowerCase())
          );

        if (!matchesSearch) return false;

        // 🛠 Expiry filter logic
        if (filter === "licenseExpired") {
          return driver.license_expiry && new Date(driver.license_expiry) < now;
        }
        if (filter === "insuranceExpired") {
          return driver.insurance_expiry && new Date(driver.insurance_expiry) < now;
        }
        if (filter === "bothExpired") {
          return (
            driver.license_expiry &&
            new Date(driver.license_expiry) < now &&
            driver.insurance_expiry &&
            new Date(driver.insurance_expiry) < now
          );
        }

        return true; // default: all drivers
      });
  }, [drivers, search, filter]);


  // ✅ Columns for react-table
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
            alt={row.original.name}
            className="tableImg"
          />
        ),
      },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "phone_number" },
      { Header: "Country", accessor: "country" },
      {
        Header: "Vehicle",
        accessor: "vehicle_type",
        Cell: ({ row }) =>
          `${row.original.vehicle_type} (${row.original.vehicle_color || "N/A"})`,
      },
      { Header: "Reg No", accessor: "registration_number" },
      { Header: "Capacity", accessor: "capacity" },
      // { Header: "Total Rides", accessor: "totalRides" },
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
            <Link to={`/driver/${row.original._id}`} state={{ driverId: row.original._id }}>
              <button className="driverListEdit">Edit</button>
            </Link>
            {/* <DeleteOutline
              className="driverListDelete"
              onClick={() => toast.info(`Delete ${row.original._id} (TODO)`)}
            /> */}
          </div>
        ),
      },
    ],
    []
  );

  // ✅ Setup table with pagination & sorting
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // current page rows
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
      data: filteredDrivers || [],
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="driverList">
      <h2 className="pageTitle">Approved Drivers</h2>

      <Chart
        data={driverStats} // keeping your chart logic separate
        title="Driver Analytics"
        grid
        dataKey="New Driver"
      />

      {/* 🔍 Search Bar */}
      <div className="searchFilterContainer">
        {/* 🔍 Search Bar */}
        <div className="searchBar">
          <Search className="searchIcon" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ⛓️ Filter Dropdown */}
        <div className="filterBar">
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Drivers</option>
            <option value="licenseExpired">License Expired</option>
            <option value="insuranceExpired">Insurance Expired</option>
            <option value="bothExpired">Both Expired</option>
          </select>
        </div>
      </div>


      {!drivers ? (
        <Spinner />
      ) : filteredDrivers?.length > 0 ? (
        <>
          <table {...getTableProps()} className="driverTable">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
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

          {/* 🔄 Pagination Controls */}
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
        <div className="noDrivers">🚫 No drivers found.</div>
      )}
    </div>
  );
}
