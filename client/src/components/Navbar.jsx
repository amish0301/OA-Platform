import React, { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { userExists, userNotExists } from '../redux/slices/userSlice';
import { Icon, Popover, Typography } from '@mui/material';
import { GrDocumentTest, GrUserAdmin } from "react-icons/gr";
import { GoSignOut } from "react-icons/go";
import axiosInstance from '../hooks/useAxios';
import Loader from './Loader';

const ProfileCard = ({ logoutHandler }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminLogout = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/admin/logout', {
        withCredentials: true
      });

      if (res.data.success) {
        setAnchorEl(null);
        toast.success(res.data.message);
        dispatch(userExists({ ...res.data.user }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <Loader show={isLoading} size={70} color='#3a1c71' />

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
      <img src={user.profileImage ? user.profileImage : 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'} alt="profile_img" className='w-10 h-10 rounded-full object-contain' onClick={handleClick} />
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

          <div className='profile-list' onClick={logoutHandler}>
            <Icon className='text-sm'><GoSignOut /></Icon>
            <Typography variant='body-1' className='leading-3'>Sign out</Typography>
          </div>

          {!user.isAdmin && <div className='profile-list' onClick={() => navigate('/admin/login')}>
            <Icon className='text-sm'><GrUserAdmin /></Icon>
            <Typography variant='body-1' className='leading-3'>Login as Admin</Typography>
          </div>
          }

          {
            user.isAdmin && <div className='profile-list' onClick={adminLogout}>
              <Icon className='text-sm'><GrUserAdmin /></Icon>
              <Typography variant='body-1' className='leading-3'>Logout as Admin</Typography>
            </div>
          }
        </div>
      </Popover>
    </div>
  )
}

const Navbar = () => {

  const [updateNav, setUpdateNav] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        navigate('/');
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
        <Link className='link-style hover:text-blue-800 text-base font-semibold' to="/test">Test</Link>
        <Link className='link-style hover:text-blue-800 text-base font-semibold tracking-tight' to="/instruction">Test Instruction</Link>
        {!isAuthenticated && <button className='px-5 py-2 bg-[#605172] rounded-lg font-semibold text-base text-white shadow-md shadow-black/50 hover:bg-[#695982] hover:transition-colors duration-300' onClick={() => navigate('/auth/login')}>Login</button>}
        {isAuthenticated && <ProfileCard logoutHandler={logoutHandler} />}
      </div>
    </nav>
  )
}

export default Navbar