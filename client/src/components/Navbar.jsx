import { Avatar, Icon, Popover, Typography } from '@mui/material';
import React, { useState } from 'react';
import { GoSignOut } from "react-icons/go";
import { GrDocumentTest, GrUserAdmin } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../hooks/useAxios';
import { STORAGE_KEY } from '../lib/config';
import { clearLocalStorage } from '../redux/localStorage';
import { resetUserState, userExists } from '../redux/slices/userSlice';

const ProfileCard = ({ logoutHandler }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminLogout = async () => {
    setAnchorEl(null);
    const toastId = toast.loading('Logging out...');
    try {
      const res = await axiosInstance.get('/admin/logout', {
        withCredentials: true
      });

      if (res.data.success) {
        toast.update(toastId, { render: res.data.message, type: 'success', isLoading: false, autoClose: 1000 });
        dispatch(userExists({ ...res.data.user }));
      }
    } catch (error) {
      toast.update(toastId, { render: error.response.data.message, type: 'error', isLoading: false, autoClose: 1200 });
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // profileImage rendering like this bcoz as redux store is storing image link which is temparory url 
  const profileImage = JSON.parse(localStorage.getItem(STORAGE_KEY))?.user?.user?.profileImage;
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
              <Icon className='text-sm'><MdDashboard /></Icon>
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
  const { isAuthenticated } = useSelector(state => state.user || {});

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
        dispatch(resetUserState());
        clearLocalStorage();
        navigate('/');
        window.location.reload();
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
        <Link className='link-style hover:text-blue-800 text-base font-semibold tracking-tight' to="/instruction">Test Instruction</Link>
        {!isAuthenticated && <button className='px-5 py-2 bg-[#605172] rounded-lg font-semibold text-base text-white shadow-md shadow-black/50 hover:bg-[#695982] hover:transition-colors duration-300' onClick={() => navigate('/auth/login')}>Login</button>}
        {isAuthenticated && <ProfileCard logoutHandler={logoutHandler} />}
      </div>
    </nav>
  )
}

export default Navbar