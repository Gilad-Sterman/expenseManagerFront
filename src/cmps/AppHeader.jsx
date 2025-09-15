import { useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import { logout } from "../store/user.actions"
import { useState } from "react"
import { HomeIcon, ListPlus, LogIn, Plus, User, BarChart3 } from 'lucide-react';

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
            <div className="header-content">
                {/* Logo Section */}
                <div className="logo-section" onClick={() => navigate(`${loggedUser ? '/' : '/login'}`)}>
                    <div className="logo-icon">
                        <BarChart3 size={32} className="logo-svg" />
                    </div>
                    <span className="logo-text">מנהל הוצאות</span>
                </div>

                {/* Desktop Navigation */}
                {loggedUser && (
                    <nav className="desktop-nav">
                        <NavLink to={'/'} className="nav-item">
                            <HomeIcon size={20} />
                            <span>לוח מחוונים</span>
                        </NavLink>
                        <NavLink to={'/expenses'} className="nav-item">
                            <ListPlus size={20} />
                            <span>הוצאות</span>
                        </NavLink>
                    </nav>
                )}

                {/* Right Section */}
                <div className="header-actions">
                    {loggedUser ? (
                        <>
                            
                            {/* User Menu */}
                            <div className="user-menu">
                                <div className="user-avatar">
                                    <User size={20} />
                                </div>
                                <div className="user-info">
                                    <span className="user-name">{loggedUser.fullname || 'משתמש'}</span>
                                </div>
                                <button className="logout-btn" onClick={onLogout} title="התנתק">
                                    <LogIn size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <NavLink to={'/login'} className="login-btn">
                            <LogIn size={20} />
                            <span>כניסה</span>
                        </NavLink>
                    )}
                </div>

                {/* Mobile Menu Button */}
                {loggedUser && (
                    <button className={`mobile-menu-btn ${showNav ? 'active' : ''}`} onClick={() => setShowNav(!showNav)}>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                )}
            </div>

            {/* Mobile Navigation */}
            {loggedUser && (
                <nav className={`mobile-nav ${showNav ? 'open' : ''}`}>
                    <NavLink to={'/'} className="mobile-nav-item" onClick={() => setShowNav(false)}>
                        <HomeIcon size={24} />
                        <span>לוח מחוונים</span>
                    </NavLink>
                    <NavLink to={'/expenses'} className="mobile-nav-item" onClick={() => setShowNav(false)}>
                        <ListPlus size={24} />
                        <span>הוצאות</span>
                    </NavLink>
                    <button className="mobile-nav-item logout" onClick={onLogout}>
                        <LogIn size={24} />
                        <span>התנתקות</span>
                    </button>
                </nav>
            )}
        </header>
    )
}