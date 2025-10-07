import { createContext, useEffect, useReducer } from "react";
import FaresReducer from "./FareReducer";


const INITIAL_STATE = {
    fares: [],
    isFetching: false,
    error: false
}

export const FaresContext = createContext(INITIAL_STATE)

export const FaresContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(FaresReducer, INITIAL_STATE)

    return (
        <FaresContext.Provider value={{
            fares: state.fares,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}
        >
            {children}
        </FaresContext.Provider>
    )
}