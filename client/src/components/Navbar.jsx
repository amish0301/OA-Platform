import React, { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {

  const [updateNav, setUpdateNav] = useState(false);
  const navigate = useNavigate();
  const user = false;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      setUpdateNav(true)
    } else {
      setUpdateNav(false)
    }
  })

  const logoutHandler = () => {
    // remove user cookies
  }

  return (
    <nav className={`flex items-center justify-between w-full px-6 py-3 ${updateNav ? 'bg-transparent fixed top-0 z-10' : 'bg-gray-400 sticky'}`}>
      <Link to={"/"} className='flex items-center'>
        <h2 className='text-xl font-bold text-blue-600'>Test</h2>
      </Link>

      <div className='hidden md:flex items-center justify-between gap-8'>
        <Link className='link-style hover:text-blue-800 text-base font-semibold' to="/">Home</Link>
        <Link className='link-style hover:text-blue-800 text-base font-semibold' to="/about">About</Link>
        {!user && <button className='px-5 py-2 bg-[#605172] rounded-lg font-semibold text-base text-white shadow-md shadow-black/50' onClick={() => navigate('/auth/login')}>Login</button>}
        {user && <button className='px-5 py-2 bg-[#605172] rounded-lg font-semibold text-base text-white shadow-md shadow-black/50' onClick={logoutHandler}>Logout</button>}
        {user && (
          <Link className='link-style text-base font-semibold' to="/profile">
            <img src="https://static.thenounproject.com/png/5034901-200.png" alt="avatar" className='w-8 h-8 rounded-full cursor-pointer' />
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar