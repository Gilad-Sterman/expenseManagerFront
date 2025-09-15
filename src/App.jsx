import { useEffect, useState } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { AppHeader } from './cmps/AppHeader'
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useSelector } from 'react-redux';
import { Signup } from './pages/Signup';
import { Logger } from 'sass';
import { Login } from './pages/Login';
import { Expenses } from './pages/Expenses';
import { RecurringExpenses } from './pages/RecurringExpenses';

function App() {
  const loggedUser = useSelector(storeState => storeState.userModule.user)

  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in milliseconds
      easing: 'ease-in-out', // Easing function
      once: true, // Animate only once while scrolling
    })
  }, [])

  return (
    <>
      <Router>
        <section className='full-page'>
          <AppHeader />
          <section className='main-content'>
            <Routes>
              <Route path="/expenses" Component={Expenses} />
              <Route path="/recurring" Component={RecurringExpenses} />
              <Route path="/signup" Component={Signup} />
              <Route path="/login" Component={Login} />
              <Route path='/' Component={Home} />
            </Routes>
          </section>
        </section>
      </Router>
    </>
  )
}

export default App
