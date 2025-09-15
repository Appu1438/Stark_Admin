import autoIcon from "../assets/images/vehicles/auto_live.png";
import sedanIcon from "../assets/images/vehicles/sedan_live.png";
import hatchbackIcon from "../assets/images/vehicles/hatchback_live.png";
import suvIcon from "../assets/images/vehicles/suv_live.png";

const getVehicleIcon = (type) => {
  switch (type) {
    case "Auto":
      return autoIcon;
    case "Sedan":
      return sedanIcon;
    case "Hatchback":
      return hatchbackIcon;
    case "Suv":
      return suvIcon;
    default:
      return sedanIcon;
  }
};

export default getVehicleIcon;
