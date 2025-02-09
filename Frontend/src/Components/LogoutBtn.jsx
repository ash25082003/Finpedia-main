// components/Header/LogoutBtn.jsx
import React from 'react'
import {useDispatch} from 'react-redux'
import apiService from '../Backend/userauth'
import { logout } from '../Store/authslice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        apiService.logoutUser().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
      className="flex items-center px-4 py-2.5 font-medium rounded-lg transition-all
        text-gray-300 hover:text-[#2ecc71] hover:bg-[#232830]
        focus:outline-none focus:ring-2 focus:ring-[#2ecc71]"
      onClick={logoutHandler}
    >
      Logout
    </button>
  )
}

export default LogoutBtn
