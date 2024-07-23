import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import { ToastContainer } from 'react-toastify'

import Home from './components/Home.jsx'
import About from './components/About.jsx'
import Login from './pages/Login.jsx'
import Test from './components/Test.jsx'
import Instruction from './pages/Instruction.jsx'
import Profile from './pages/Profile.jsx'
import AdminLayout from './layout/AdminLayout.jsx'
import Dashboard from './components/admin/Dashboard.jsx'
import CreateTest from './components/admin/CreateTest.jsx'
import ForgetPassword from './components/ForgetPassword.jsx'
import Loader from './components/Loader.jsx'
import NotFound from './components/NotFound.jsx'

const LoginSuccess = () => {
  return (
    <div>Thanks for Log In!</div>
  )
}

const App = () => {

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='test/:id' element={<Test />} />
        </Route>

        {/* auth routes */}
        <Route path='/auth'>
          <Route path='login' index element={<Login />} />
          <Route path='forget' element={<ForgetPassword />} />
          <Route path='login/success' element={<LoginSuccess />} />
        </Route>

        <Route path='/test/instruction' element={<Instruction />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/profile/:id' element={<Profile />} />

        {/* Admin routes */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='dashboard' index element={<Dashboard />} />
          <Route path='create-test/:id' element={<CreateTest />} />
        </Route>
      </Routes>
      <ToastContainer position='top-right' autoClose={1500} />
    </Suspense>
  )
}

export default App