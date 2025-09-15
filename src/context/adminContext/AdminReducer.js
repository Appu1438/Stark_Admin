const AdminReducer = (state, action) => {

    switch (action.type) {
        case "GET_ADMINS_START":
            return {
                admins: [],
                isFetching: true,
                error: false
            }
        case "GET_ADMINS_SUCCESS":
            return {
                admins: action.payload,
                isFetching: false,
                error: false
            }
        case "GET_ADMINS_FAILURE":
            return {
                admins: null,
                isFetching: false,
                error: true
            }
        case "ACTIVATE_ADMIN_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "ACTIVATE_ADMIN_SUCCESS":
            return {
                admins: state.admins.map(
                    (admin) => admin._id === action.payload._id && action.payload),
                isFetching: false,
                error: false
            }
        case "ACTIVATE_ADMIN_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "DEACTIVATE_ADMIN_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "DEACTIVATE_ADMIN_SUCCESS":
            return {
                admins: state.admins.map(
                    (admin) => admin._id === action.payload._id && action.payload),
                isFetching: false,
                error: false
            }
        case "DEACTIVATE_ADMIN_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "CREATE_ADMIN_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "CREATE_ADMIN_SUCCESS":
            return {
                admins: [...state.admins, action.payload], // add new admin to array
                isFetching: false,
                error: false,
            }
        case "CREATE_ADMIN_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "UPDATE_ADMIN_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "UPDATE_ADMIN_SUCCESS":
            return {
                admins: state.admins.map(
                    (admin) => admin._id === action.payload._id && action.payload),
                isFetching: false,
                error: false
            }
        case "UPDATE_ADMIN_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return { ...state }

    }
}


export default AdminReducer