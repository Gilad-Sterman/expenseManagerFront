import { useState } from "react"
import { userService } from "../services/user.service"
import { useNavigate } from "react-router-dom"
import { login } from "../store/user.actions"
import { MsgModal } from "../cmps/MsgModal"

export function Signup() {
    const [user, setUser] = useState({ username: '' })
    const [showMsgModal, setShowMsgModal] = useState(false)
    const navigate = useNavigate()

    function setNewUser({ target }) {
        const field = target.name
        const value = target.value
        user[field] = value
        const newUser = JSON.parse(JSON.stringify(user))
        setUser(newUser)
    }

    async function onSignup(ev) {
        ev.preventDefault()
        user.expenses = []
        login(user)
        navigate('/')
        return
        try {
            const res = await userService.signup(user)
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
        <section className="signup-page" >
            <h2>הרשמה</h2>
            <section className="main-content">
                <form onSubmit={(ev) => onSignup(ev)}>
                    <div className="my-input">
                        <label htmlFor="username">שם משתמש:</label>
                        <input type="text" name="username" id="username" required onInput={setNewUser} />
                    </div>
                    <button>הרשמה</button>
                </form>
                <button onClick={() => navigate('/login')}>יש לכם חשבון? היכנסו כאן</button>
                {showMsgModal && <MsgModal text={showMsgModal.txt} />}
            </section>
        </section>
    )
}