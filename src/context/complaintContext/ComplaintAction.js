export const getComplaintsStart = () => ({
    type: 'GET_COMPLAINTS_START'
})

export const getComplaintsSuccess = (complaints) => ({
    type: 'GET_COMPLAINTS_SUCCESS',
    payload: complaints
})

export const getComplaintsFailure = () => ({
    type: 'GET_COMPLAINTS_FAILURE'
})

export const updateComplaintsStart = () => ({
    type: 'UPDATE_COMPLAINTS_START'
})

export const updateComplaintsSuccess = (complaint) => ({
    type: 'UPDATE_COMPLAINTS_SUCCESS',
    payload: complaint
})

export const updateComplaintsFailure = () => ({
    type: 'UPDATE_COMPLAINTS_FAILURE'
})
