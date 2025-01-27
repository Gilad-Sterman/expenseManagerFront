import { useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import { logout } from "../store/user.actions"
import { useState } from "react"

export function AppHeader() {
    const loggedUser = useSelector(storeState => storeState.userModule.user)
    const [showNav, setShowNav] = useState(false)
    const navigate = useNavigate()

    function onLogout() {
        setShowNav(false)
        logout()
    }

    return (
        <header className="app-header">
            <div className="logo" onClick={() => navigate(`${loggedUser ? '/' : '/login'}`)}>
                <img src="https://res.cloudinary.com/dollaguij/image/upload/v1721751939/icons/bar-chart_eaq23k.png" alt="" />
            </div>
            {loggedUser && <div className={`nav-btn ${showNav ? 'close' : 'open'}`} onClick={() => setShowNav(!showNav)}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>}
            {loggedUser && <nav className={`${showNav ? 'opened' : 'closed'}`}>
                <NavLink to={'/'} onClick={() => setShowNav(false)}>
                    <img src="https://res.cloudinary.com/dollaguij/image/upload/v1699194283/svg/selected-home_sdspes.svg" alt="" />
                </NavLink>
                <NavLink to={'/expenses'} onClick={() => setShowNav(false)}>
                    <img src="https://res.cloudinary.com/dollaguij/image/upload/v1737633921/icons/bill_s9oc27.png" alt="" />
                </NavLink>
                <NavLink to={'/login'} onClick={() => onLogout()}>
                    <img src="https://res.cloudinary.com/dollaguij/image/upload/v1702281692/icons8-logout-32_rpd7my.png" alt="" />
                </NavLink>
            </nav>}
        </header>
    )
}