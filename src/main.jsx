import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//Components
import Home from './component/Home.jsx'
import LoginForm from './component/LoginForm.jsx'
import RegisterForm from './component/RegisterForm.jsx'
//import router เชื่อมต่อหน้าอื่นๆ
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/login",
    element: <LoginForm/>,
  },
  {
    path: "/register",
    element: <RegisterForm/>,
  },
    {
    path: "/home",
    element: <Home/>,
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

