import { useEffect, useState } from "react";
import "./widgetLg.css";
import axiosInstance from "../../api/axiosInstance";

export default function WidgetLg() {
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  const [newDrivers, setNewDrivers] = useState([]);

  useEffect(() => {
    const getNewDrivers = async () => {
      try {
        const res = await axiosInstance.get(`/admin/drivers?new=true`);
        setNewDrivers(res.data.drivers);
      } catch (error) {
        console.log(error);
      }
    };
    getNewDrivers();
  }, []);

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">New Drivers Status</h3>
      <table className="widgetLgTable">
        <tbody>
          <tr className="widgetLgTr">
            <th className="widgetLgTh">Driver</th>
            <th className="widgetLgTh">Email</th>
            <th className="widgetLgTh">Phone Number</th>
            <th className="widgetLgTh">Vehicle Type</th>
            <th className="widgetLgTh">Status</th>
          </tr>

          {newDrivers.map((driver) => (
            <tr className="widgetLgTr" key={driver._id}>
              <td className="widgetLgUser">
                <img
                  src={
                    driver.profileImage ||
                    "https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  }
                  alt={driver.name}
                  className="widgetLgImg"
                />
                <span className="widgetLgName">{driver.name}</span>
              </td>
              <td className="widgetLgEmail">{driver.email}</td>
              <td className="widgetLgPhone">{driver.phone_number}</td>
              <td className="widgetLgPhone">{driver.vehicle_type}</td>
              <td className="widgetLgStatus">
                <Button type={driver.is_approved ? "Approved" : "Pending"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
