import { userService } from "../services/user.service";

export const SET_USER = 'SET_USER'

const initialState = {
    user: userService.getLoggedinUser(),
}

export function userReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case SET_USER:
            newState = { ...state, user: action.user }
            break
        default:
    }
    return newState
}