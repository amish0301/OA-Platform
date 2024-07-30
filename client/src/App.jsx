import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import { ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'

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
import ProtectRoute from './lib/ProtectRoute.jsx'
import { userExists } from './redux/slices/userSlice.js';
import AssignedTest from './pages/AssignedTest.jsx';
import TestDashboard from './layout/TestDashboard.jsx';
import TestCompleted from './components/TestCompleted.jsx';
import AdminLogin from './components/admin/Login.jsx';
import { ProtectAdminRoute } from './lib/ProtectAdminRoute.jsx';

const LoginSuccess = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcUser = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/auth/login/success`, {
          withCredentials: true
        })
        if (res.data.success) {
          dispatch(userExists({ ...res.data.user }))
          navigate('/', { replace: true })
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
    fetcUser()
  }, [])

  return <Loader show={loading} size={70} color='#3a1c71' />
}

const App = () => {
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useSelector(state => state.user);
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, [500]);

    return () => clearTimeout(timer);
  }, [])

  if (loading) return <Loader show={loading} size={70} color='#3a1c71' />

  return (
    <Suspense fallback={<div>Loading..</div>}>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='test' element={<ProtectRoute user={isAuthenticated}><Test /></ProtectRoute>} />
          <Route path='*' element={<NotFound />} />
        </Route>

        {/* auth routes */}
        <Route path='/auth'>
          <Route path='login' index element={<ProtectRoute redirect="/" user={!isAuthenticated}><Login /></ProtectRoute>} />
          <Route path='forget' element={<ForgetPassword />} />
          <Route path='login/success' element={<LoginSuccess />} />
        </Route>

        <Route path='/instruction' element={<ProtectRoute user={isAuthenticated}><Instruction /></ProtectRoute>} />
        <Route path='/profile/:id' element={<Profile />} />

        <Route path='/test-dashboard' exact element={<TestDashboard />}>
          <Route path='assigned' element={<AssignedTest />} />
          <Route path='completed' element={<TestCompleted />} />
        </Route>

        {/* Admin routes */}
        <Route path='/admin' element={<ProtectRoute user={isAuthenticated}><ProtectAdminRoute isAdmin={isAdmin}><AdminLayout /></ProtectAdminRoute></ProtectRoute>}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='create-test/:id' element={<CreateTest />} />
        </Route>

        <Route path='/admin/login' element={<AdminLogin />} />
      </Routes>
      <ToastContainer position='top-right' autoClose={1500} theme='dark' />
    </Suspense>
  )
}

export default App