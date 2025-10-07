export const getFaresStart = () => ({
    type: 'GET_FARES_START'
})

export const getFaresSuccess = (fares) => ({
    type: 'GET_FARES_SUCCESS',
    payload: fares
})

export const getFaresFailure = () => ({
    type: 'GET_FARES_FAILURE'
})

export const createFaresStart = () => ({
    type: 'CREATE_FARES_START'
})

export const createFaresSuccess = (fares) => ({
    type: 'CREATE_FARES_SUCCESS',
    payload: fares
})

export const createFaresFailure = () => ({
    type: 'CREATE_FARES_FAILURE'
})

export const updateFaresStart = () => ({
    type: 'UPDATE_FARES_START'
})

export const updateFaresSuccess = (fares) => ({
    type: 'UPDATE_FARES_SUCCESS',
    payload: fares
})

export const updateFaresFailure = () => ({
    type: 'UPDATE_FARES_FAILURE'
})
