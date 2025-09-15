const DriverReducer = (state, action) => {

    switch (action.type) {
        case "GET_DRIVERS_START":
            return {
                drivers: [],
                isFetching: true,
                error: false
            }
        case "GET_DRIVERS_SUCCESS":
            return {
                drivers: action.payload,
                isFetching: false,
                error: false
            }
        case "GET_DRIVERS_FAILURE":
            return {
                drivers: null,
                isFetching: false,
                error: true
            }
        case "APPROVE_DRIVER_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "APPROVE_DRIVER_SUCCESS":
            return {
                drivers: state.drivers.map(
                    (driver) => driver._id === action.payload._id && action.payload
                ),
                isFetching: false,
                error: false
            }
        case "APPROVE_DRIVER_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "DEAPPROVE_DRIVER_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "DEAPPROVE_DRIVER_SUCCESS":
            return {
                drivers: state.drivers.map(
                    (driver) => driver._id === action.payload._id && action.payload
                ),
                isFetching: false,
                error: false
            }
        case "DEAPPROVE_DRIVER_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "UPDATE_DRIVER_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "UPDATE_DRIVER_SUCCESS":
            return {
                drivers: state.drivers.map(
                    (driver) => driver._id === action.payload._id && action.payload
                ),
                isFetching: false,
                error: false
            }
        case "UPDATE_DRIVER_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "DELETE_DRIVER_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "DELETE_DRIVER_SUCCESS":
            return {
                drivers: state.drivers.filter(driver => driver._id !== action.payload),
                isFetching: false,
                error: false
            }
        case "DELETE_DRIVER_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return { ...state }

    }
}


export default DriverReducer