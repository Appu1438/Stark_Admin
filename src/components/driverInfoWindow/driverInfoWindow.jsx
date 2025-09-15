import { Link } from "react-router-dom";
import "./driverinfo.css";

const getAvatar = (gender) => {
  if (gender?.toLowerCase() === "male") {
    return "https://i.pravatar.cc/150?img=12";
  } else if (gender?.toLowerCase() === "female") {
    return "https://i.pravatar.cc/150?img=47";
  } else {
    return "https://i.pravatar.cc/150";
  }
};

export default function DriverInfoWindow({ driver, position }) {
  if (!driver) return null;

  const avatar = driver?.profilePic || getAvatar(driver?.gender);

  return (
    <div
      className="driver-info-window"
      style={{ top: position.y, left: position.x }}
    >
      {/* Avatar */}
      <img src={avatar} alt={driver.name} className="info-window-avatar" />

      {/* Details */}
      <div className="info-window-details">
        <p className="info-window-name">{driver.name}</p>
        <p className="info-window-vehicle">
          🚗 {driver.vehicle_type} ({driver.vehicle_color})
        </p>
        <p className="info-window-reg">📋 {driver.registration_number}</p>
        <p className="info-window-phone">📞 {driver.phone_number}</p>
        <p className="info-window-email">✉️ {driver.email}</p>
        <p className="info-window-coords">
          📍 Lat: {driver.latitude?.toFixed(4)} | Lng:{" "}
          {driver.longitude?.toFixed(4)}
        </p>

        {/* Link to details page */}
       
      </div>
    </div>
  );
}
