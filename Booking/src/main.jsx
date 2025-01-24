import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Home from './Pages/Home.jsx'






const router = createBrowserRouter([
    {
      path: "/",
      element: <App />, // Main layout component that wraps all other components
      children: [
        {
          path: "/",
          element: <Home />,
        },
        
        
      ],
    },
  ]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store = {store}>
    <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
