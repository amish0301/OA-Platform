import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'

import Home from './components/Home.jsx'
import About from './components/About.jsx'
import Login from './pages/Login.jsx'

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route path='/' index element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/test/:id' element={<Test />}/>
          <Route path='/test-instruction' element={<Instruction />} />
        </Route>

        <Route path='/login' element={<Login />} />
        <Route path='*' element={<Navigate to={'/'} />} />
      </Routes>
    </Suspense>
  )
}

export default App