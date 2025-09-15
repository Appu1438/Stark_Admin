export const getDriversStart = () => ({
    type: 'GET_DRIVERS_START'
})

export const getDriversSuccess = (drivers) => ({
    type: 'GET_DRIVERS_SUCCESS',
    payload: drivers
})

export const getDriversFailure = () => ({
    type: 'GET_DRIVERS_FAILURE'
})

export const approveDriverStart = () => ({
    type: 'APPROVE_DRIVER_START'
})

export const approveDriverSuccess = (driver) => ({
    type: 'APPROVE_DRIVER_SUCCESS',
    payload: driver
})

export const approveDriverFailure = () => ({
    type: 'APPROVE_DRIVER_FAILURE'
})

export const deApproveDriverStart = () => ({
    type: 'DEAPPROVE_DRIVER_START'
})

export const deApproveDriverSuccess = (driver) => ({
    type: 'DEAPPROVE_DRIVER_SUCCESS',
    payload: driver
})

export const deApproveDriverFailure = () => ({
    type: 'DEAPPROVE_DRIVER_FAILURE'
})

export const updateDriverStart = () => ({
    type: 'UPDATE_DRIVER_START'
})

export const updateDriverSuccess = (driver) => ({
    type: 'UPDATE_DRIVER_SUCCESS',
    payload: driver 
})

export const updateDriverFailure = () => ({
    type: 'UPDATE_DRIVER_FAILURE'
})

export const deleteDriverStart = () => ({
    type: 'DELETE_DRIVER_START'
})

export const deleteDriverSuccess = (id) => ({
    type: 'DELETE_DRIVER_SUCCESS',
    payload: id 
})

export const deleteDriverFailure = () => ({
    type: 'DELETE_DRIVER_FAILURE'
})
