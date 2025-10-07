import React, { useEffect, useRef, useState } from "react";
import { useDriverStore } from "../../store/driverStore";
import getVehicleIcon from "../../utils/getVehicleIcon";
import socketService from "../../utils/socketServices";
import "./map.css";
import axios from "axios";
import { Link } from "react-router-dom";
import DriverInfoWindow from "../../components/driverInfoWindow/driverInfoWindow";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import icons
import axiosInstance from "../../api/axiosInstance";

export default function Map() {
    const { driverLists, setDriverLists, updateDriverLocation } = useDriverStore();
    const [driverLoader, setDriverLoader] = useState(true);
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const mapInstanceRef = useRef(null);
    const [hoveredDriver, setHoveredDriver] = useState(null);
    const [infoWindowPosition, setInfoWindowPosition] = useState({ x: 0, y: 0 });
    const [isPanelOpen, setIsPanelOpen] = useState(true); // State for panel visibility

    // Initialize Google Map
    useEffect(() => {
        if (!window.google) {
            console.error("Google Maps not loaded!");
            return;
        }

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 9.6195, lng: 76.3542 },
            zoom: 13,
            mapId: process.env.REACT_APP_GOOGLE_MAP_ID
        });

        mapInstanceRef.current = map;
    }, []);

    // Handle socket connections & updates
    useEffect(() => {
        socketService.connectAsAdmin();

        socketService.clearListeners()

        socketService.onAllDrivers(async (driversFromSocket) => {
            if (!driversFromSocket || driversFromSocket.length === 0) {
                setDriverLists([]);
                setDriverLoader(false);
                return;
            }

            const driverIds = driversFromSocket.map((d) => d.id).join(",");

            try {
                const res = await axiosInstance.get(
                    `/driver/get-drivers-data`,
                    { params: { ids: driverIds } }
                );

                const dbDrivers = res.data;
                const merged = dbDrivers.map((dbDriver) => {
                    const socketDriver = driversFromSocket.find(
                        (d) => d.id === dbDriver.id
                    );
                    return {
                        ...dbDriver,
                        latitude: socketDriver?.current?.latitude,
                        longitude: socketDriver?.current?.longitude,
                        heading: socketDriver?.heading || 0,
                    };
                });

                console.log(merged)
                setDriverLists(merged);
                setDriverLoader(false);

            } catch (err) {
                console.error("❌ Driver fetch failed:", err);
            } finally {
                setDriverLoader(false);
            }
        });

        socketService.onDriverLocationUpdates((updates) => {
            updateDriverLocation(updates);
        });

        return () => {
            socketService.clearListeners();
            socketService.disconnect()
        }
    }, [setDriverLists, updateDriverLocation]);

    // Update markers when drivers change
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear old markers
        Object.values(markersRef.current).forEach((marker) => marker.setMap(null));
        markersRef.current = {};

        driverLists.forEach((driver) => {
            if (!driver.latitude || !driver.longitude) return;

            const icon = document.createElement("img");
            icon.src = getVehicleIcon(driver.vehicle_type);
            icon.style.width = "40px";
            icon.style.height = "50px";
            icon.style.transform = `rotate(${driver.heading || 0}deg)`; // rotate in degrees
            icon.style.transformOrigin = "center"; // rotate around center
            icon.style.cursor = "pointer"; // Indicate interactivity

            const marker = new window.google.maps.marker.AdvancedMarkerElement({
                position: { lat: driver.latitude, lng: driver.longitude },
                map: mapInstanceRef.current,
                content: icon,
            });

            // Hover events
            icon.addEventListener("mouseenter", (e) => {
                setHoveredDriver(driver);
                const mapRect = mapRef.current.getBoundingClientRect();
                setInfoWindowPosition({
                    x: e.clientX - mapRect.left + 15,
                    y: e.clientY - mapRect.top + 15,
                });
            });

            icon.addEventListener("mouseleave", () => {
                setHoveredDriver(null);
            });

            markersRef.current[driver.id] = marker;
        });
    }, [driverLists]);

    // Avatar selection based on gender
    const getAvatar = (gender) => {
        if (gender?.toLowerCase() === "male") {
            return "https://i.pravatar.cc/150?img=12";
        } else if (gender?.toLowerCase() === "female") {
            return "https://i.pravatar.cc/150?img=47";
        } else {
            return "https://i.pravatar.cc/150";
        }
    };

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className="mapWrapper">
            <h2 className="pageTitle">Driver Live Map</h2>

            <div ref={mapRef} className="mapContainer"></div>

            {/* Custom Floating InfoWindow */}
            {hoveredDriver && <DriverInfoWindow driver={hoveredDriver} position={infoWindowPosition} />}


            {/* Floating Driver Panel and its separate toggle button */}
            {/* The toggle button is now separate from the panel itself */}
            <button className={`toggle-btn ${isPanelOpen ? "open" : "closed"}`} onClick={togglePanel}>
                {isPanelOpen ? <FaChevronRight /> : <FaChevronLeft />}
            </button>

            <div className={`driverPanel ${isPanelOpen ? "open" : "closed"}`}>
                <div className="panel-content">
                    <h2 className="panelTitle">Live Drivers</h2>
                    <ul className="driverList">
                        {driverLoader ? (
                            <li className="loadingItem">Loading drivers...</li>
                        ) : driverLists.length === 0 ? (
                            <li className="noDrivers">No active drivers found.</li>
                        ) : (
                            driverLists.map((driver) => {
                                const hasCoords = driver.latitude && driver.longitude;
                                if (hasCoords) {
                                    return (
                                        <Link className="link" to={`/driver/${driver.id}`} key={driver?.id} state={{ driverId: driver?.id }}>
                                            <li className="driverItem">
                                                <img src={driver?.profilePic || getAvatar(driver?.gender)} className="panelProfile" alt="" />
                                                <div>
                                                    <p className="driverName">{driver.name}</p>
                                                    <p className="driverCoords">
                                                        {driver?.registration_number} , {driver.vehicle_type}
                                                    </p>
                                                </div>
                                            </li>
                                        </Link>
                                    );
                                }
                                return null;
                            })
                        )}
                    </ul>
                </div>
            </div>
        </div >
    );
}