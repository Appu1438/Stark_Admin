const RidesReducer = (state, action) => {

    switch (action.type) {
        case "GET_RIDES_START":
            return {
                rides: [],
                isFetching: true,
                error: false
            }
        case "GET_RIDES_SUCCESS":
            return {
                rides: action.payload,
                isFetching: false,
                error: false
            }
        case "GET_RIDES_FAILURE":
            return {
                rides: null,
                isFetching: false,
                error: true
            }
        default:
            return { ...state }

    }
}


export default RidesReducer