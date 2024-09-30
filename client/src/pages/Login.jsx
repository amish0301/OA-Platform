import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaUser as UserIcon } from "react-icons/fa";
import { GoEyeClosed as ClosedIcon, GoEye as OpenIcon } from "react-icons/go";
import { MdEmail as MailIcon } from "react-icons/md";
import { RiLockPasswordFill as PasswordIcon } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import google from '../assets/google.png';
import sideImg from '../assets/learning.jpg';
import signup from '../assets/login.jpg';
import useFetchQuery from '../hooks/useFetchData';
import { userExists } from '../redux/slices/userSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [eyeOpen, setEyeOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { response: signupResponse, error: signupError, isLoading: isLoadingSignUp, refetch: SignUpFnc } = useFetchQuery('/auth/signup', 'POST', formData, config);
  const { response: loginResponse, error: loginError, isLoading: isLoadingLogin, refetch: LoginFnc } = useFetchQuery('/auth/login', 'POST', formData, config);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const validateForm = () => {
    const errors = {};
    const emailRegx = /\S+@\S+\.\S+/;

    if (!emailRegx.test(formData.email)) {
      errors.email = 'Email is Invalid';
    }

    if (formData.password.length < 4) {
      errors.password = 'Password must be at least 4 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (isLogin) LoginFnc();
      else SignUpFnc()
    }
    // empty fields
    setFormData({
      name: formErrors.name ? formData.name : '',
      email: formErrors.email ? formData.email : '',
      password: formErrors.password ? formData.password : ''
    });

    if (!formErrors) {
      setFormErrors({});
    }
  }

  useEffect(() => {
    if (loginResponse) {
      toast.success(loginResponse.message);
      dispatch(userExists(loginResponse.user));
      localStorage.setItem("accessToken", loginResponse.accessToken);
      navigate('/', { replace: true })
    }
    if (loginError) {
      toast.error(loginError);
    }
  }, [loginResponse, loginError])

  useEffect(() => {
    if (signupResponse) {
      toast.success(signupResponse.message);
      setIsLogin(true);
    } else if (signupError) {
      toast.error(signupError);
    }
  }, [signupResponse, signupError])

  const handleGoogleLogin = async () => {
    window.open(`${import.meta.env.VITE_SERVER_URI}/auth/google`, "_self");
  };

  return (
    <section className='bg-gray-50 min-h-screen flex items-center justify-center'>
      <div className='bg-gray-100 flex rounded-2xl shadow-xl max-w-3xl w-full p-5 items-center'>
        <div className='md:w-1/2 md:px-12 px-8 py-2'>
          {isLogin ? <p className='text-3xl font-bold text-[#002D74]'>Login</p> : <p className='text-3xl font-bold text-[#002D74]'>Signup</p>}
          {isLogin && <p className='text-xs font-medium mt-4 text-[#002D74]'>if you already have an account, easily <span className='text-black text-sm'>Login</span></p>}

          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            {!isLogin &&
              <div className='relative'>
                <span className='m-auto border-r border-r-orange-200 absolute p-2 top-1/2 left-0 rounded-l-lg items-center z-10'>
                  <UserIcon className='text-gray-500 text-lg' />
                </span>
                <input type='text' className={`pl-10 pr-4 py-3 mt-8 rounded-lg border w-full ${formErrors.name ? 'border-red-500' : ''}`} placeholder='enter your name' name='name' required onChange={handleChange} autoComplete='on' aria-label='name' value={formData.name} />
                {formErrors.name && <p className='text-red-500 text-xs'>{formErrors.name}</p>}
              </div>
            }

            <div className='relative'>
              <span className={`m-auto border-r border-r-orange-200 absolute p-2 ${isLogin ? 'top-[40px]' : 'top-[7px]'} left-0 rounded-l-lg items-center z-10`}><MailIcon className='text-gray-500 text-lg' /></span>
              <input type="email" className={`px-10 py-3 ${isLogin ? 'mt-8' : ''} rounded-lg border w-full`} placeholder='email' name='email' required value={formData.email} onChange={handleChange} autoComplete='on' aria-label='email' />
              {formErrors.email && <p className='text-red-500 text-xs'>{formErrors.email}</p>}
            </div>

            <div className='relative'>
              <span className='m-auto border-r border-r-orange-200 absolute p-2 top-[7px] rounded-l-lg left-0 items-center z-10'><PasswordIcon className='text-gray-500 text-lg' /></span>
              <input type={`${eyeOpen ? 'text' : 'password'}`} className='px-10 py-3 rounded-lg border w-full' placeholder='password' name='password' required value={formData.password} onChange={handleChange} aria-label='password' autoComplete='on' />
              <span className='text-lg absolute top-[25px] right-3 -translate-y-1/2 cursor-pointer' onClick={() => setEyeOpen(prev => !prev)}>
                {eyeOpen ? <OpenIcon /> : <ClosedIcon />}
              </span>
              {formErrors.password && <p className='text-red-500 text-xs'>{formErrors.password}</p>}
            </div>

            <button className='bg-[#5783db] hover:bg-[#002D74]/90 duration-300 text-white font-semibold py-2 rounded-lg mt-5 focus:outline-1 focus:border-none focus:outline-offset-1' disabled={isLoadingSignUp || isLoadingLogin}>
              <div className='flex justify-center items-center gap-2'>
                {(isLoadingLogin || isLoadingSignUp) && <CircularProgress color='inherit' size={18} />}
                <span className='text-sm font-semibold'>{isLogin ? 'Login' : 'Signup'}</span>
              </div>
            </button>
          </form>

          <div className='mt-6 grid grid-cols-3 items-center text-gray-400'>
            <hr className='border-gray-400' />
            <p className='text-center text-sm font-medium'>OR</p>
            <hr className='border-gray-400' />
          </div>

          <button className='bg-gray-200 hover:bg-gray-300 duration-300 rounded-lg border py-2 w-full mt-5 flex justify-center items-center' onClick={handleGoogleLogin}>
            <img src={google} alt="google" className='w-6 h-6' />
            <span className='ml-1 text-sm font-semibold'>Continue with Google</span>
          </button>


          {isLogin && <div className='mt-5 text-xs border-b py-4 border-gray-400 text-[#002D74] underline cursor-pointer' onClick={() => navigate('/auth/forget')}>Forget your Password?</div>}
          <div className='mt-3 text-xs flex justify-between items-center'>
            {isLogin ? <p className='text-gray-400'>Don't have an account? <span className='text-blue-800 cursor-pointer hover:underline' onClick={() => setIsLogin(prev => !prev)}>Register</span></p> : <p className='text-gray-400'>Already have an account? <span className='text-blue-800 cursor-pointer hover:underline' onClick={() => setIsLogin(prev => !prev)}>Login</span></p>}
          </div>
        </div>

        {/* image */}
        <div className='md:block hidden w-1/2'>
          <img src={isLogin ? sideImg : signup} alt="login_img" className='rounded-2xl bg-blend-normal' />
        </div>
      </div>
    </section>
  )

}
export default Login