const TransactionReducer = (state, action) => {

    switch (action.type) {
        case "GET_TRANSACTIONS_START":
            return {
                transactions: [],
                isFetching: true,
                error: false
            }
        case "GET_TRANSACTIONS_SUCCESS":
            return {
                transactions: action.payload,
                isFetching: false,
                error: false
            }
        case "GET_TRANSACTIONS_FAILURE":
            return {
                transactions: null,
                isFetching: false,
                error: true
            }
        default:
            return { ...state }

    }
}


export default TransactionReducer