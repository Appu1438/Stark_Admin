import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import "./home.css";
import axiosInstance from "../../api/axiosInstance";

export default function Home() {
  const MONTHS = useMemo(
    () => [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    []
  );

  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    const getUserStat = async () => {
      try {
        const response = await axiosInstance.get(`users/stats`);
        const stateList = response.data.sort((a, b) => a._id - b._id);

        const formattedStats = stateList.map((item) => ({
          name: MONTHS[item._id - 1],
          "New User": item.total,
        }));

        setUserStats(formattedStats);
      } catch (error) {
        console.error(error);
      }
    };
    getUserStat();
  }, [MONTHS]);

  console.log(userStats);

  return (
    <div className="home">
      <FeaturedInfo />
      <Chart
        data={userStats}
        title="User Analytics"
        grid
        dataKey="New User"
      />
      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
}
