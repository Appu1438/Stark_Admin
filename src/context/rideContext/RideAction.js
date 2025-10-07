export const getRidesStart = () => ({
    type: 'GET_RIDES_START'
})

export const getRidesSuccess = (rides) => ({
    type: 'GET_RIDES_SUCCESS',
    payload: rides
})

export const getRidesFailure = () => ({
    type: 'GET_RIDES_FAILURE'
})
