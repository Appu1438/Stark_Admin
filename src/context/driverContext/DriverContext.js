import { createContext, useEffect, useReducer } from "react";
import DriverReducer from "./DriverReducer";


const INITIAL_STATE = {
    drivers: [],
    isFetching: false,
    error: false
}

export const DriverContext = createContext(INITIAL_STATE)

export const DriverContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(DriverReducer, INITIAL_STATE)

    return (
        <DriverContext.Provider value={{
            drivers: state.drivers,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}
        >
            {children}
        </DriverContext.Provider>
    )
}