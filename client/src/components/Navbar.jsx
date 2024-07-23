import React, { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { userNotExists } from '../redux/slices/userSlice';
import { Icon, Popover, Typography } from '@mui/material';
import { GrDocumentTest } from "react-icons/gr";
import { GoSignOut } from "react-icons/go";

const ProfileCard = ({ logoutHandler }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.user);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className='cursor-pointer w-fit'>
      <img src="https://i.pravatar.cc/300" alt="" className='w-12 h-12 rounded-full' onClick={handleClick} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className='p-3 shadow-md shadow-zinc-300 bg-gray-200 rounded-lg'>
          <div className='flex gap-4 items-center justify-start mb-4'>
            <img src="https://i.pravatar.cc/300" alt="profile_img" className='w-12 h-12 rounded-full' />
            <Link to={`/profile/${user._id}`}>
              <Typography className='text-sm font-medium text-green-600'>{user.name}</Typography>
            </Link>
          </div>

          <div className='profile-list'>
            <Icon className='text-sm'><GrDocumentTest /></Icon>
            <Typography className='leading-3' variant='body-1'>
              My Tests
            </Typography>
          </div>

          <div className='profile-list' onClick={logoutHandler}>
            <Icon className='text-sm'><GoSignOut /></Icon>
            <Typography variant='body-1' className='leading-3'>Sign out</Typography>
          </div>
        </div>
      </Popover>
    </div>
  )
}

const Navbar = () => {

  const [updateNav, setUpdateNav] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      setUpdateNav(true)
    } else {
      setUpdateNav(false)
    }
  })

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/user/logout`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(import.meta.env.VITE_TOKEN)}`
        }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(userNotExists())
        localStorage.removeItem(import.meta.env.VITE_TOKEN)
      }
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  return (
    <nav className={`flex items-center justify-between w-full px-20 py-3 ${updateNav ? 'bg-gray-100 border-none fixed top-0' : 'bg-transparent backdrop-blur-[15px] border-b border-gray-300 sticky'}`}>
      <Link to={"/"} className='flex items-center'>
        <h2 className='text-xl font-bold text-blue-600'>YourPrepPartner</h2>
      </Link>

      <div className='hidden md:flex items-center justify-between gap-8'>
        <Link className='link-style hover:text-blue-800 text-base font-semibold' to="/">Home</Link>
        <Link className='link-style hover:text-blue-800 text-base font-semibold' to="/about">About</Link>
        <Link className='link-style hover:text-blue-800 text-base font-semibold tracking-tight' to="test/instruction">Test Instruction</Link>
        {!user && <button className='px-5 py-2 bg-[#605172] rounded-lg font-semibold text-base text-white shadow-md shadow-black/50 hover:bg-[#695982] hover:transition-colors duration-300' onClick={() => navigate('/auth/login')}>Login</button>}
        {/* {user && <button className='px-5 py-2 bg-[#605172] rounded-lg font-semibold text-base text-white shadow-md shadow-black/50' onClick={logoutHandler}>Logout</button>} */}
        {user && <ProfileCard logoutHandler={logoutHandler} />}
      </div>
    </nav>
  )
}

export default Navbar