import "./driverList.css";
import { DeleteOutline, Search } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import Spinner from "../../components/spinner/Spinner";
import axiosInstance from "../../api/axiosInstance";
import Chart from "../../components/chart/Chart";
import { DriverContext } from "../../context/driverContext/DriverContext";
import { getDrivers } from "../../context/driverContext/apiCalls";
import { toast } from "react-toastify";
import { useTable, usePagination, useSortBy } from "react-table";
import DataTable from "../../components/dataTable/DataTable";

export default function NonApprovedDriverList() {
  const { drivers, dispatch } = useContext(DriverContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getDrivers(dispatch, toast);
  }, [dispatch]);

  // ✅ Columns for DataTable
  const columns = useMemo(
    () => [
      {
        Header: "Profile",
        accessor: "profilePic",
        Cell: ({ value }) => (
          <img
            src={
              value && value.trim() !== ""
                ? value
                : "https://th.bing.com/th?id=OIP.EwG6x9w6RngqsKrPJYxULAHaHa"
            }
            alt="driver"
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
      {
        Header: "Ratings",
        accessor: "ratings",
        Cell: ({ value }) => (value ? `⭐ ${value.toFixed(1)}` : "N/A"),
      }
    ],
    [navigate]
  );

  // ✅ Use the generic DataTable
  return (
    <div className="driverList">
      {/* <h2 className="pageTitle">Non-Approved Drivers</h2> */}

      <DataTable
        title="Non-Approved Drivers"
        data={drivers.filter((d) => d.is_approved == false)} // keep only non-approved
        columns={columns}
        showCreate={false}
        searchPlaceholder="Search drivers..."
        showFilter={true}

        filterOptions={[
          "All",
          "License Expired",
          "Insurance Expired",
          "Both Expired",
        ]}
        filterKey={["status"]}
        buttonName={'Edit'}
        onButtonClick={(driver) =>
          navigate(`/driver/${driver._id}`, {
            state: { driverId: driver._id },
          })
        }
      />
    </div>
  );
}
