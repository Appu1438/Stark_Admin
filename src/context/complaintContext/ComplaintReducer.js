const ComplaintReducer = (state, action) => {

    switch (action.type) {
        case "GET_COMPLAINTS_START":
            return {
                complaints: [],
                isFetching: true,
                error: false
            }
        case "GET_COMPLAINTS_SUCCESS":
            return {
                complaints: action.payload,
                isFetching: false,
                error: false
            }
        case "GET_COMPLAINTS_FAILURE":
            return {
                complaints: [],
                isFetching: false,
                error: true
            }
        case "UPDATE_COMPLAINTS_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "UPDATE_COMPLAINTS_SUCCESS":
            return {
                complaints: state.complaints.map((complaint) =>
                    complaint._id === action.payload._id ? action.payload : complaint
                ),
                isFetching: false,
                error: false,
            };

        case "UPDATE_COMPLAINTS_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return { ...state }

    }
}


export default ComplaintReducer