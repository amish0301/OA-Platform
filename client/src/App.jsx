import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppLayout from './layout/AppLayout.jsx';

import axios from 'axios';
import About from './components/About.jsx';
import Dashboard from './components/admin/Dashboard.jsx';
import AdminLogin from './components/admin/Login.jsx';
import CreateTest from './components/admin/pages/CreateTest.jsx';
import ForgetPassword from './components/ForgetPassword.jsx';
import Home from './components/Home.jsx';
import Loader from './components/Loader.jsx';
import NotFound from './components/NotFound.jsx';
import Test from './components/Test.jsx';
import TestCompleted from './components/TestCompleted.jsx';
import axiosInstance from './hooks/useAxios.js';
import AdminLayout from './layout/AdminLayout.jsx';
import TestDashboard from './layout/TestDashboard.jsx';
import { ProtectAdminRoute } from './lib/ProtectAdminRoute.jsx';
import ProtectRoute from './lib/ProtectRoute.jsx';
import AssignedTest from './pages/AssignedTest.jsx';
import Instruction from './pages/Instruction.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import { setToken, userExists } from './redux/slices/userSlice.js';

// Admin Pages
import TestManagement from './components/admin/pages/TestManagement.jsx';
import UserManagement from './components/admin/pages/UserManagement.jsx';
import EditTest from './shared/EditTest.jsx';

const LoginSuccess = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/auth/login/success`, {
          withCredentials: true
        });

        if (res.data.success && res.data.user) {
          dispatch(userExists(res.data.user))
          dispatch(setToken(res.data.refreshToken))
          navigate('/', { replace: true })
        }
      } catch (error) {
        throw error
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [dispatch, navigate])

  if (loading) return <Loader show={loading} size={70} color='#3a1c71' />
}

const App = () => {
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.user || {});
  const dispatch = useDispatch();
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get('/user/me');
        dispatch(userExists(data.user));
      } catch (error) {
        throw error
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [dispatch])

  if (loading) return <Loader show={loading} size={70} color='#3a1c71' />

  return (
    <Suspense fallback={<div>Loading..</div>}>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route path='/test' element={<ProtectRoute user={isAuthenticated}><Test /></ProtectRoute>} />

        {/* auth routes */}
        <Route path='/auth'>
          <Route path='login' index element={<ProtectRoute redirect="/" user={!isAuthenticated}><Login /></ProtectRoute>} />
          <Route path='forget' element={<ForgetPassword />} />
          <Route path='login/success' element={<LoginSuccess />} />
        </Route>

        <Route path='/instruction' element={<ProtectRoute user={isAuthenticated}><Instruction /></ProtectRoute>} />
        <Route path='/profile/:id' element={<Profile />} />

        <Route path='/test/dashboard' exact element={<TestDashboard />}>
          <Route path='assigned' element={<AssignedTest />} />
          <Route path='completed' element={<TestCompleted />} />
        </Route>

        {/* Admin routes */}
        <Route path='/admin' element={<ProtectRoute user={isAuthenticated}><ProtectAdminRoute isAdmin={isAdmin}><AdminLayout /></ProtectAdminRoute></ProtectRoute>}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='tests/create' element={<CreateTest />} />
          <Route path='users' element={<UserManagement />} />
          <Route path='tests' element={<TestManagement />} />
          <Route path='tests/edit/:id' element={<EditTest />} />
        </Route>

        <Route path='/admin/login' element={<AdminLogin />} />
      </Routes>
      <ToastContainer position='top-right' autoClose={1500} theme='dark' />
    </Suspense>
  )
}

export default App