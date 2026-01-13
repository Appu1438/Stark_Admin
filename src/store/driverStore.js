// store/driverStore.ts
import { create } from "zustand";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

export const useDriverStore = create((set, get) => ({
  driverLists: [],

  setDriverLists: (lists) => set({ driverLists: lists }),

  updateDriverLocation: async (updates) => {
    console.log(updates)
    let driverLists = [...get().driverLists];
    const newDriverIds = [];

    updates.forEach((update) => {
      const index = driverLists.findIndex((d) => d.id === update.id);

      if (index !== -1) {
        // ✅ Update existing driver
        driverLists[index] = {
          ...driverLists[index],
          latitude: update.current?.latitude,
          longitude: update.current?.longitude,
          heading: update.heading,
        };
      } else {
        // 🚨 New driver detected → fetch from backend
        newDriverIds.push(update.id);
      }
    });

    // Update existing ones first
    set({ driverLists });

    // If new drivers found → fetch from backend
    if (newDriverIds.length > 0) {
      try {
        const res = await axiosInstance.get("/driver/get-drivers-data",
          { params: { ids: newDriverIds.join(",") } }
        );

        const dbDrivers = res.data.map((dbDriver) => {
          const socketUpdate = updates.find((u) => u.id === dbDriver.id);
          return {
            ...dbDriver,
            latitude: socketUpdate?.current?.latitude,
            longitude: socketUpdate?.current?.longitude,
            heading: socketUpdate?.heading || 0,
          };
        });

        // ✅ Merge new drivers into the store
        set((state) => ({
          driverLists: [...state.driverLists, ...dbDrivers],
        }));
      } catch (err) {
        console.error("❌ Failed to fetch new driver details:", err);
      }
    }
  },
}));
