import { createContext, useEffect, useReducer } from "react";
import RidesReducer from "./RideReducer";


const INITIAL_STATE = {
    rides: [],
    isFetching: false,
    error: false
}

export const RidesContext = createContext(INITIAL_STATE)

export const RidesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(RidesReducer, INITIAL_STATE)

    return (
        <RidesContext.Provider value={{
            rides: state.rides,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}
        >
            {children}
        </RidesContext.Provider>
    )
}