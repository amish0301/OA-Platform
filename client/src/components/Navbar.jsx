import { Avatar, Icon, Popover, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { GoSignOut } from "react-icons/go";
import { GrDocumentTest, GrUserAdmin } from "react-icons/gr";
import { RiMenuUnfold2Line as MenuClose, RiMenuFold2Line as MenuOpen, RiDashboardFill as Dashboard } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../hooks/useAxios';
import { clearLocalStorage } from '../redux/localStorage';
import { userExists, userNotExists } from '../redux/slices/userSlice';

const ProfileCard = ({ logoutHandler }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const adminLogout = async () => {
    handleClose();
    const toastId = toast.loading('Logging out...');
    try {
      const res = await axiosInstance.get('/admin/logout', {
        withCredentials: true
      });

      if (res.data.success) {
        toast.update(toastId, { render: res.data.message, type: 'success', isLoading: false, autoClose: 1000 });
        dispatch(userExists({ ...res.data.user }));
        if (window.location.pathname !== '/') navigate('/', { replace: true });
      }
    } catch (error) {
      toast.update(toastId, { render: error.response.data.message, type: 'error', isLoading: false, autoClose: 1200 });
    }
  }


  const handleLogout = () => {
    handleClose();
    logoutHandler();
  }

  // profileImage rendering like this bcoz as redux store is storing image link which is temparory url 
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const profileImage = JSON.parse(localStorage.getItem('reduxState'))?.user?.user?.profileImage;
  return (
    <div className='cursor-pointer w-fit'>
      <Avatar src={profileImage} onClick={handleClick} alt='profile image' aria-labelledby='avatar' />
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
            <img src={user?.profileImage} alt="profile_img" className='w-8 h-8 rounded-full' />
            <Link to={`/profile/${user?._id}`}>
              <Typography className='text-sm font-medium text-green-600'>{user?.name}</Typography>
            </Link>
          </div>

          <div className='profile-list' onClick={() => navigate('/test/dashboard')}>
            <Icon className='text-sm'><GrDocumentTest /></Icon>
            <Typography className='leading-3' variant='body-1'>
              Test Dashboard
            </Typography>
          </div>

          {
            user?.isAdmin && <div className='profile-list' onClick={() => navigate('/admin/dashboard')}>
              <Icon className='text-sm'><Dashboard /></Icon>
              <Typography variant='body-1' className='leading-3'>Admin Dashboard</Typography>
            </div>
          }

          {!user?.isAdmin && <div className='profile-list' onClick={() => navigate('/admin/login')}>
            <Icon className='text-sm'><GrUserAdmin /></Icon>
            <Typography variant='body-1' className='leading-3'>Login as Admin</Typography>
          </div>
          }

          {
            user?.isAdmin && <div className='profile-list' onClick={adminLogout}>
              <Icon className='text-sm'><GrUserAdmin /></Icon>
              <Typography variant='body-1' className='leading-3'>Logout as Admin</Typography>
            </div>
          }

          <div className='profile-list' onClick={handleLogout}>
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
  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.user);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      setUpdateNav(true)
    } else {
      setUpdateNav(false)
    }
  })

  const logoutHandler = async () => {
    try {
      const res = await axiosInstance.get('/auth/logout');
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(userNotExists());
        clearLocalStorage();
      }
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  return (
    <>
      <nav className={`flex items-center justify-between w-full px-6 md:px-20 py-3 ${updateNav ? 'bg-gray-100 border-none fixed top-0 z-50 w-full' : 'bg-transparent backdrop-blur-[15px] overflow-hidden border-b border-gray-300 sticky'}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h2 className="text-xl font-bold text-blue-600">YourPrepPartner</h2>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link className="text-lg font-semibold text-gray-700 hover:text-blue-800 transition-all duration-200" to="/">Home</Link>
          <Link className="text-lg font-semibold text-gray-700 hover:text-blue-800 transition-all duration-200" to="/about">About</Link>
          <Link className="text-lg font-semibold text-gray-700 hover:text-blue-800 transition-all duration-200" to="/instruction">Test Instruction</Link>
          {!isAuthenticated && (
            <button
              className="px-4 py-1 bg-[#605172] rounded-md font-semibold text-base text-white shadow-md shadow-black/50 hover:bg-[#695982] transition-colors duration-300"
              onClick={() => navigate('/auth/login')}
            >
              Login
            </button>
          )}
          {isAuthenticated && <ProfileCard logoutHandler={logoutHandler} />}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobile(!isMobile)} className={`relative flex items-center justify-center w-11 h-11 rounded-lg shadow-md transition-all duration-300 active:scale-90
          ${isMobile ? "bg-gray-500 hover:bg-gray-600" : "bg-white/20 backdrop-blur-lg hover:bg-white/30"}`} >
            <MenuClose className='text-3xl text-gray-800' />
          </button>
        </div>
      </nav>

      {/* Sidebar for Mobile Devices */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-xl px-8 py-5 z-50 transform w-3/4 transition-all duration-500 ease-in-out ${isMobile ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
      >
        <div className="flex w-full items-center relative">
          <button
            onClick={() => setIsMobile(false)}
            className="text-gray-700 absolute right-0 top-0 rounded-lg shadow-md transition-all duration-300 active:scale-90"
          >
            <MenuOpen className="text-3xl" />
          </button>
        </div>
        <div className="flex flex-col gap-4 pt-10">
          <Link
            className="text-lg font-semibold text-gray-700 hover:text-blue-800 transition-all duration-300"
            to="/"
            onClick={() => setIsMobile(false)}
          >
            Home
          </Link>
          <Link
            className="text-lg font-semibold text-gray-700 hover:text-blue-800 transition-all duration-300"
            to="/about"
            onClick={() => setIsMobile(false)}
          >
            About
          </Link>
          <Link
            className="text-lg font-semibold text-gray-700 hover:text-blue-800 transition-all duration-300"
            to="/instruction"
            onClick={() => setIsMobile(false)}
          >
            Test Instruction
          </Link>
          {!isAuthenticated && (
            <button
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-lg font-semibold text-white shadow-md hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/auth/login")}
            >
              Login
            </button>
          )}
          {isAuthenticated && <ProfileCard logoutHandler={logoutHandler} />}
        </div>
      </div>
    </>
  );
}

export default Navbar