import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import Register from './Components/Register.jsx'
import Login from './Components/Login.jsx'
import Home from './Components/Home.jsx'
import TripForm from './Components/TripForm.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <div>Error: Page Not Found!</div>
  },
  {
    path:"/home",
    element:<Home/>
  },
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/admin/trip-form",
    element:<TripForm/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)