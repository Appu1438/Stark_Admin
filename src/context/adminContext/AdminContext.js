import { createContext, useEffect, useReducer } from "react";
import AdminReducer from "./AdminReducer";


const INITIAL_STATE = {
    admins: [],
    isFetching: false,
    error: false
}

export const AdminContext = createContext(INITIAL_STATE)

export const AdminContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AdminReducer, INITIAL_STATE)

    return (
        <AdminContext.Provider value={{
            admins: state.admins,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}
        >
            {children}
        </AdminContext.Provider>
    )
}