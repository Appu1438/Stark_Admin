import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";

export default function useDriverStats() {
    const MONTHS = useMemo(
        () => [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        []
    );

    const [driverStats, setDriverStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                // Fetch Drivers
                const driverResponse = await axiosInstance.get(`/admin/drivers/stats`);
                const sortedDrivers = driverResponse.data.sort((a, b) => a._id - b._id);
                setDriverStats(
                    sortedDrivers.map((item) => ({
                        name: MONTHS[item._id - 1],
                        "New Driver": item.total,
                    }))
                );
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [MONTHS]);

    return { driverStats, loading };
}
