import { useEffect, useState } from "react";
import "./featuredInfo.css";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import axiosInstance from "../../api/axiosInstance";

export default function FeaturedInfo({ number }) {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    revenueThisMonth: 0,
    transactionsThisMonth: 0,
    revenueLastMonth: 0,
    transactionsLastMonth: 0,
    revenueChange: 0,
    transactionsChange: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/admin/transactions-info", { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.error("Featured info fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const renderCard = (title, value, change = null) => (
    <div className="featuredItem" key={title}>
      <div className="featuredTitleContainer">
        <span className="featuredTitle">{title}</span>
        {change !== null && <span className="featuredSub">Compared to last month</span>}
      </div>
      <div className="featuredMoneyContainer">
        <span className="featuredMoney">{value}</span>
        {change !== null && (
          <span className="featuredMoneyRate">
            {change.toFixed(1)}%
            {change >= 0 ? (
              <ArrowUpward className="featuredIcon" />
            ) : (
              <ArrowDownward className="featuredIcon negative" />
            )}
          </span>
        )}
      </div>
    </div>
  );

  const transactionStats = [
    { title: "Revenue This Month", value: `₹${data.revenueThisMonth}`, change: data.revenueChange },
    { title: "Transactions This Month", value: data.transactionsThisMonth, change: data.transactionsChange },
    { title: "Revenue Last Month", value: `₹${data.revenueLastMonth}` },
    { title: "Transactions Last Month", value: data.transactionsLastMonth },
    { title: "Total Revenue", value: `₹${data.totalRevenue}` },
    { title: "Total Transactions", value: data.totalTransactions },
  ];

  // If number = 4 → first 4 cards
  // If number = 6 → all 6 cards
  const displayedStats = transactionStats.slice(0, number);

  return (
    <div className="featured">
      {displayedStats.map((item) =>
        renderCard(item.title, item.value, item.change ?? null)
      )}
    </div>
  );
}
