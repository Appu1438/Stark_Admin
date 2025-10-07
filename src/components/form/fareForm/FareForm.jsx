import React, { useState, useEffect } from "react";
import "./fareForm.css";
import { districts } from "../../../utils/districts";
import Select from "react-select";

export default function FareFormModal({ show, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        vehicle_type: "",
        baseFare: "",
        perKmRate: "",
        perMinRate: "",
        minFare: "",
        surgeMultiplier: "",
        district: ""
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDistricts, setFilteredDistricts] = useState(districts);
    const districtOptions = districts.map((d) => ({ value: d, label: d }));

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                vehicle_type: "",
                baseFare: "",
                perKmRate: "",
                perMinRate: "",
                minFare: "",
                surgeMultiplier: "",
                district: ""
            });
        }
    }, [initialData]);

    useEffect(() => {
        const filtered = districts.filter((d) =>
            d.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDistricts(filtered);
    }, [searchQuery]);

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{initialData ? "Edit Fare Details" : "Create Fare"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Vehicle Type:</label>
                    <select
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        disabled={initialData}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Auto">Auto</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Suv">Suv</option>
                    </select>

                    <label>District:</label>
                    <Select
                        options={districtOptions}
                        value={districtOptions.find(opt => opt.value === formData.district)}
                        onChange={(selected) => setFormData({ ...formData, district: selected.value })}
                        placeholder="Select or search district..."
                        isSearchable
                        isDisabled={initialData}
                        required
                    />


                    <label>Base Fare:</label>
                    <input type="number" name="baseFare" value={formData.baseFare} onChange={handleChange} required />

                    <label>Per Km Rate:</label>
                    <input type="number" name="perKmRate" value={formData.perKmRate} onChange={handleChange} required />

                    <label>Per Minute Rate:</label>
                    <input type="number" name="perMinRate" value={formData.perMinRate} onChange={handleChange} required/>

                    <label>Min Fare:</label>
                    <input type="number" name="minFare" value={formData.minFare} onChange={handleChange} required />

                    <label>Surge Multiplier:</label>
                    <input type="number" name="surgeMultiplier" value={formData.surgeMultiplier} onChange={handleChange} />

                    {/* 🔍 Searchable District Dropdown */}
                    {/* <input
                        type="text"
                        placeholder="Search district..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    /> */}

                    {/* <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        size={5}
                        style={{ width: "100%", marginTop: "5px" }}
                    >
                        {filteredDistricts.map((district, index) => (
                            <option key={index} value={district}>
                                {district}
                            </option>
                        ))}
                    </select> */}

                    <div className="modal-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
