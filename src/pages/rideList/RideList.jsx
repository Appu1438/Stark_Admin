import React, { useContext, useEffect, useMemo } from "react";
import DataTable from "../../components/dataTable/DataTable";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext/AuthContext";
import { TransactionContext } from "../../context/transactionContext/TransactionContext";
import { getTransactions } from "../../context/transactionContext/apiCalls";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import './rideList.css'
import { RidesContext } from "../../context/rideContext/RideContext";
import { getRides } from "../../context/rideContext/apiCalls";
export default function RideList() {
    const { rides, dispatch } = useContext(RidesContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        getRides(dispatch, toast);
        console.log('rides', rides)
    }, [dispatch]);

    const columns = useMemo(
        () => [
            { Header: "Pickup Location", accessor: "currentLocationName", },
            { Header: "Drop Location", accessor: "destinationLocationName" },
            { Header: "Distance", accessor: "distance" },
            {
                Header: "Vehicle",
                accessor: "driverId", // access the full driver object
                Cell: ({ value }) => {
                    if (!value) return "N/A";
                    const { vehicle_type, registration_number } = value;
                    return `${vehicle_type || "Unknown"} • ${registration_number || "N/A"}`;
                },
            },
            { Header: "Status", accessor: "status" },
            { Header: "Total Fare", accessor: "totalFare" },
            { Header: "Driver Share", accessor: "driverEarnings" },
            { Header: "Platform Share", accessor: "platformShare" },
            { Header: "Driver Name", accessor: "driverId.name" },
            { Header: "Customer Name", accessor: "userId.name" },
        ],
        []
    );

    const handleEditClick = (ride) => {
        navigate(`/ride/${ride._id}`, { state: { rideId: ride._id } });
    };

    return (
        <div className="container">
            <div>
                <DataTable
                    title="Rides"
                    data={rides || []}
                    columns={columns}
                    showCreate={false}
                    buttonName={'View'}
                    onButtonClick={handleEditClick}
                    searchPlaceholder="Search by name, email, or phone..."
                    showFilter={true}
                    filterOptions={["Booked", "Processing", "Ongoing", "Completed"]}
                    filterKey="status"
                />
            </div>
        </div>
    );
}
