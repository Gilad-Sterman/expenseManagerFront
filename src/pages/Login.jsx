import { useEffect, useState } from "react"
import { userService } from "../services/user.service"
import { useNavigate } from "react-router-dom"
import { MsgModal } from "../cmps/MsgModal"
import { login } from "../store/user.actions"

export function Login() {
    const [user, setUser] = useState({ username: '', password: '' })
    const [showMsgModal, setShowMsgModal] = useState(false)
    const navigate = useNavigate()

    function setNewUser({ target }) {
        const field = target.name
        const value = target.value
        user[field] = value
        const newUser = JSON.parse(JSON.stringify(user))
        setUser(newUser)
    }

    async function onLogin(ev) {
        ev.preventDefault()
        try {
            const res = await userService.login(user)
            if (res._id) {
                login(res)
                navigate('/')
            } else {
                handleErrMsg(res)
            }
        } catch (err) {
            console.log(err)
        }
    }

    function handleErrMsg(msg) {
        setShowMsgModal(msg)
        setTimeout(() => setShowMsgModal(false), 2500)
    }

    return (
        <section className="login-page" >
            <h2>התחברות</h2>
            <section className="main-content">
                <form onSubmit={(ev) => onLogin(ev)}>
                    <div className="my-input">
                        <label htmlFor="username">שם משתמש:</label>
                        <input type="text" name="username" id="username" required onInput={setNewUser} />
                    </div>
                    <div className="my-input">
                        <label htmlFor="password">סיסמא:</label>
                        <input type="password" name="password" id="password" required onInput={setNewUser} />
                    </div>
                    <button>כניסה</button>
                </form>
                <button onClick={() => navigate('/signup')}>אין לכם חשבון? הירשמו כאן</button>
                {showMsgModal && <MsgModal text={showMsgModal.txt} />}
            </section>
        </section>
    )
}