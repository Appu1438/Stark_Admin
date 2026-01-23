import { createContext, useEffect, useReducer } from "react";
import ComplaintReducer from "./ComplaintReducer";


const INITIAL_STATE = {
    complaints: [],
    isFetching: false,
    error: false
}

export const ComplaintContext = createContext(INITIAL_STATE)

export const ComplaintContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(ComplaintReducer, INITIAL_STATE)

    return (
        <ComplaintContext.Provider value={{
            complaints: state.complaints,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}
        >
            {children}
        </ComplaintContext.Provider>
    )
}