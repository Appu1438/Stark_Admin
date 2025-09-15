import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function useStats() {
  const MONTHS = useMemo(
    () => [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    []
  );

  const [userStats, setUserStats] = useState([]);
  const [driverStats, setDriverStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch Users
        const userResponse = await axiosInstance.get(`/users/stats`);
        const sortedUsers = userResponse.data.sort((a, b) => a._id - b._id);
        setUserStats(
          sortedUsers.map((item) => ({
            name: MONTHS[item._id - 1],
            "New User": item.total,
          }))
        );

        // Fetch Drivers
        const driverResponse = await axiosInstance.get(`/drivers/stats`);
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

  return { userStats, driverStats, loading };
}
