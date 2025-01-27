import { userService } from "../services/user.service";
import { store } from "./store";
import { SET_USER } from "./user.reducer";

export function login(user) {
    userService.saveLocalUser(user)
    store.dispatch({
        type: SET_USER,
        user
    })
}

export function updateUser(user) {
    userService.saveLocalUser(user)
    store.dispatch({
        type: SET_USER,
        user
    })
}

export function logout() {
    userService.logout()
    store.dispatch({
        type: SET_USER,
        user: null
    })
}