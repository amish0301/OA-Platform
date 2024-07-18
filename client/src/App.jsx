import React, { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './redux/slices/userSlice.js'

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

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home user={user} />} />
          <Route path='about' element={<About />} />
          <Route path='test/:id' element={user ? <Test /> : <Navigate to={'/login'} />} />
        </Route>

        {/* auth routes */}
        <Route path='/auth'>
          <Route path='login' index element={user ? <Navigate to={'/'} /> : <Login />} />
          <Route path='forget' element={<ForgetPassword />} />
        </Route>

        <Route path='/test/instruction' element={<Instruction />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='*' element={<Navigate to={'/'} />} />

        {/* Admin routes */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='dashboard' index element={<Dashboard />} />
          <Route path='create-test/:id' element={<CreateTest />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App