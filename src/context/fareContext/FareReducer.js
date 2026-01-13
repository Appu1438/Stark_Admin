const FaresReducer = (state, action) => {

    switch (action.type) {
        case "GET_FARES_START":
            return {
                fares: [],
                isFetching: true,
                error: false
            }
        case "GET_FARES_SUCCESS":
            return {
                fares: action.payload,
                isFetching: false,
                error: false
            }
        case "GET_FARES_FAILURE":
            return {
                fares: [],
                isFetching: false,
                error: true
            }
        case "CREATE_FARES_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "CREATE_FARES_SUCCESS":
            return {
                fares: [...state.fares, action.payload], // add new fares to array
                isFetching: false,
                error: false,
            }
        case "CREATE_FARES_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "UPDATE_FARES_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "UPDATE_FARES_SUCCESS":
            return {
                fares: state.fares.map((fare) =>
                    fare._id === action.payload._id ? action.payload : fare
                ),
                isFetching: false,
                error: false,
            };

        case "UPDATE_FARES_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return { ...state }

    }
}


export default FaresReducer