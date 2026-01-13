import React, { useState, useEffect } from "react";
import "./fareForm.css";
import { districts } from "../../../utils/districts";
import Select from "react-select";

export default function FareFormModal({ show, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        vehicle_type: "",
        baseFare: "",
        baseFareUptoKm: "",
        perKmRate: "",
        perMinRate: "",
        surgeMultiplier: 1,
        district: "",
    });

    const districtOptions = districts.map((d) => ({
        value: d,
        label: d,
    }));

    useEffect(() => {
        if (initialData) {
            setFormData({
                vehicle_type: initialData.vehicle_type,
                baseFare: initialData.baseFare,
                baseFareUptoKm: initialData.baseFareUptoKm,
                perKmRate: initialData.perKmRate,
                perMinRate: initialData.perMinRate,
                surgeMultiplier: initialData.surgeMultiplier,
                district: initialData.district,
            });
        }
    }, [initialData]);

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
                    <label>Vehicle Type</label>
                    <select
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        disabled={!!initialData}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Auto">Auto</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Suv">Suv</option>
                    </select>

                    <label>District</label>
                    <Select
                        options={districtOptions}
                        value={districtOptions.find(
                            (opt) => opt.value === formData.district
                        )}
                        onChange={(selected) =>
                            setFormData({ ...formData, district: selected.value })
                        }
                        isSearchable
                        isDisabled={!!initialData}
                        placeholder="Select district"
                    />

                    <label>Base Fare (Minimum Fare)</label>
                    <input
                        type="number"
                        name="baseFare"
                        value={formData.baseFare}
                        onChange={handleChange}
                        required
                    />

                    <label>Base Fare Upto (Km)</label>
                    <input
                        type="number"
                        name="baseFareUptoKm"
                        value={formData.baseFareUptoKm}
                        onChange={handleChange}
                        required
                    />

                    <label>Per Km Rate</label>
                    <input
                        type="number"
                        name="perKmRate"
                        value={formData.perKmRate}
                        onChange={handleChange}
                        required
                    />

                    <label>Per Minute Rate</label>
                    <input
                        type="number"
                        name="perMinRate"
                        value={formData.perMinRate}
                        onChange={handleChange}
                        required
                    />

                    <label>Surge Multiplier</label>
                    <input
                        type="number"
                        step="0.1"
                        name="surgeMultiplier"
                        value={formData.surgeMultiplier}
                        onChange={handleChange}
                    />

                    <div className="modal-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
