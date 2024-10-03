const initialState = {
    token: localStorage.getItem('token'),
    user: null
}

export const user = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return {
                ...state,
                token: localStorage.getItem('token'),
                user: action.payload
            }
        case 'USER_LOGOUT':
            return {
                ...state,
                token: null,
                user: null
            }
        default:
            return state
    }
}