import { useState } from 'react'
import './App.css'

import { Routes, Route } from "react-router-dom";

// Components
import LoginForm from './component/LoginForm.jsx'
import RegisterForm from './component/RegisterForm.jsx'
import Navbar from './component/Navbar.jsx'
import Home from './component/Home.jsx'


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
