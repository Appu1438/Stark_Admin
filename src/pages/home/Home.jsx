import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import "./home.css";
import axiosInstance from "../../api/axiosInstance";
import useStats from "../../hooks/stats/useStats";

export default function Home() {
 
  const { userStats, driverStats, loading } = useStats();

  return (
    <div className="home">
      <FeaturedInfo />
      <Chart
        data={userStats}
        title="User Analytics"
        grid
        dataKey="New User"
      />

      <Chart
        data={driverStats}
        title="Driver Analytics"
        grid
        dataKey="New Driver" // ✅ will now match
      />

      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
}
