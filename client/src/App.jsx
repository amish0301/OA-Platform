import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux';

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

// const LoginSuccess = () => {
//   const navigate = useNavigate()
//   useEffect(() => {
//     const id = setTimeout(() => {
//       navigate('/', { replace: true })
//     }, 2000)

//     return () => {
//       clearTimeout(id)
//     }
//   }, [])
//   return <div>Thanks for Login!!</div>
// }

const App = () => {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector(state => state.user);

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
          <Route path='test/:id' element={<ProtectRoute><Test /></ProtectRoute>} />
        </Route>

        {/* auth routes */}
        <Route path='/auth'>
          <Route path='login' index element={<ProtectRoute redirect="/" user={!isAuthenticated}><Login /></ProtectRoute>} />
          <Route path='forget' element={<ForgetPassword />} />
          {/* <Route path='login/success' element={<LoginSuccess />} /> */}
        </Route>

        <Route path='/test/instruction' element={<ProtectRoute><Instruction /></ProtectRoute>} />
        <Route path='*' element={<NotFound />} />
        <Route path='/profile/:id' element={<Profile />} />

        {/* Admin routes */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='dashboard' index element={<Dashboard />} />
          <Route path='create-test/:id' element={<CreateTest />} />
        </Route>
      </Routes>
      <ToastContainer position='top-right' autoClose={1500} theme='dark' />
    </Suspense>
  )
}

export default App