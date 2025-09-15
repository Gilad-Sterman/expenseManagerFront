import { httpService } from './http.service.js'

const STORAGE_KEY = 'user'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const users = [
    {
        _id: '123454',
        username: 'gilad',
        expenses: [
            {
                date: "2025-01-24",
                desc: "טבק",
                id: "jMKnFE",
                paid: 98,
                type: "סיגריות"
            },
            {
                date: "2025-01-26",
                desc: "קניות",
                id: "2PevJK",
                paid: 36,
                type: "קניות אוכל"
            },
            {
                date: "2025-01-17",
                desc: "טבק",
                id: "2PfghJK",
                paid: 105,
                type: "סיגריות"
            },
            {
                date: "2025-02-17",
                desc: "סיגריות",
                id: "2Pfghth",
                paid: 35,
                type: "סיגריות"
            },
        ]
    },
    {
        _id: '24567',
        username: 'user2',
        expenses: []
    },
]

export const userService = {
    login,
    signup,
    logout,
    saveLocalUser,
    getLoggedinUser,
}

function saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

async function login(user) {
    // return new Promise(resolve => setTimeout(() => resolve(users.find(u => u.username === user.username)), 200))
    try {
        const userRes = await httpService.get(`${STORAGE_KEY}/login`, user)
        return userRes
    } catch (err) {
        console.log(err)
    }
}

async function signup(user) {
    try {
        const userRes = await httpService.get(`${STORAGE_KEY}/signup`, user)
        return userRes
    } catch (err) {
        console.log(err)
    }
}

function logout() {
    return sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}
