export const getAdminsStart = () => ({
    type: 'GET_ADMINS_START'
})

export const getAdminsSuccess = (admins) => ({
    type: 'GET_ADMINS_SUCCESS',
    payload: admins
})

export const getAdminsFailure = () => ({
    type: 'GET_ADMINS_FAILURE'
})


export const activateAdminStart = () => ({
    type: 'ACTIVATE_ADMIN_START'
})

export const activateAdminSuccess = (admin) => ({
    type: 'ACTIVATE_ADMIN_SUCCESS',
    payload: admin 
})

export const activateAdminFailure = () => ({
    type: 'DEACTIVATE_ADMIN_FAILURE'
})

export const deActivateAdminStart = () => ({
    type: 'DEACTIVATE_ADMIN_START'
})

export const deActivateAdminSuccess = (admin) => ({
    type: 'DEACTIVATE_ADMIN_SUCCESS',
    payload: admin 
})

export const deActivateAdminFailure = () => ({
    type: 'DEACTIVATE_ADMIN_FAILURE'
})

export const createAdminStart = () => ({
    type: 'CREATE_ADMIN_START'
})

export const createAdminSuccess = (admin) => ({
    type: 'CREATE_ADMIN_SUCCESS',
    payload: admin 
})

export const createAdminFailure = () => ({
    type: 'CREATE_ADMIN_FAILURE'
})
export const updateAdminStart = () => ({
    type: 'UPDATE_ADMIN_START'
})

export const updateAdminSuccess = (admin) => ({
    type: 'UPDATE_ADMIN_SUCCESS',
    payload: admin 
})

export const updateAdminFailure = () => ({
    type: 'UPDATE_ADMIN_FAILURE'
})

