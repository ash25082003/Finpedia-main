import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import apiService from './Backend/userauth'
import { login , logout } from './Store/authslice'
import Footer from './Components/Footer'
import Header from './Components/Header'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    apiService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        console.log(userData)
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  return  (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
        <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) 
}

export default App
