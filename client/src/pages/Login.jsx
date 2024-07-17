import React, { useEffect, useState } from 'react'
import { GoEyeClosed as ClosedIcon, GoEye as OpenIcon } from "react-icons/go";
import google from '../assets/google.png'
import sideImg from '../assets/learning.jpg'
import signup from '../assets/login.jpg'
import { FaUser as UserIcon } from "react-icons/fa";
import { MdEmail as MailIcon } from "react-icons/md";
import { RiLockPasswordFill as PasswordIcon } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  document.title = 'Login | Online Assessment';
  const navigate = useNavigate();

  const [eyeOpen, setEyeOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Form Submitted Successfully');
    }

    // empty fields
    const id = setTimeout(() => {
      setFormData({ name: '', email: '', password: '' });
      setFormErrors({});
    }, [1500])

    return () => {
      window.clearTimeout(id);
    }
  }

  const handleGoogleLogin = () => {
    window.open(`${import.meta.env.VITE_SERVER_URI}/auth/google/callback`, '_self');
  }

  return (
    <section className='bg-gray-50 min-h-screen flex items-center justify-center'>
      <div className='bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl w-full p-5 items-center'>
        <div className='md:w-1/2 md:px-12 px-8 py-2'>
          {isLogin ? <p className='text-3xl font-bold text-[#002D74]'>Login</p> : <p className='text-3xl font-bold text-[#002D74]'>Signup</p>}
          {isLogin && <p className='text-xs font-medium mt-4 text-[#002D74]'>if you already have an account, easily <span className='text-black text-sm'>Login</span></p>}

          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            {!isLogin &&
              <div className='relative'>
                <span className='m-auto border-r border-r-orange-200 absolute p-2 top-1/2 left-0 rounded-l-lg items-center z-10'>
                  <UserIcon className='text-gray-500 text-lg' />
                </span>
                <input type='text' className={`pl-10 pr-4 py-3 mt-8 rounded-lg border w-full ${formErrors.name ? 'border-red-500' : ''}`} placeholder='enter your name' name='name' required onChange={handleChange} value={formData.name} />
                {formErrors.name && <p className='text-red-500 text-xs'>{formErrors.name}</p>}
              </div>
            }
            <div className='relative'>
              <span className={`m-auto border-r border-r-orange-200 absolute p-2 ${isLogin ? 'top-[40px]' : 'top-[7px]'} left-0 rounded-l-lg items-center z-10`}><MailIcon className='text-gray-500 text-lg' /></span>
              <input type="email" className={`px-10 py-3 ${isLogin ? 'mt-8' : ''} rounded-lg border w-full`} placeholder='email' name='email' required value={formData.email} onChange={handleChange} />
              {formErrors.email && <p className='text-red-500 text-xs'>{formErrors.email}</p>}
            </div>

            <div className='relative'>
              <span className='m-auto border-r border-r-orange-200 absolute p-2 top-[7px] rounded-l-lg left-0 items-center z-10'><PasswordIcon className='text-gray-500 text-lg' /></span>
              <input type={`${eyeOpen ? 'text' : 'password'}`} className='px-10 py-3 rounded-lg border w-full' placeholder='password' name='password' required value={formData.password} onChange={handleChange} />
              <span className='text-lg absolute top-[25px] right-3 -translate-y-1/2 cursor-pointer' onClick={() => setEyeOpen(prev => !prev)}>
                {eyeOpen ? <OpenIcon /> : <ClosedIcon />}
              </span>
              {formErrors.password && <p className='text-red-500 text-xs'>{formErrors.password}</p>}
            </div>

            {isLogin ? (<button className='bg-[#002D74] hover:bg-[#002D74]/90 duration-300 text-white py-2 rounded-lg mt-5'>Login</button>) : (
              <button className='bg-[#002D74] hover:bg-[#002D74]/90 duration-300 text-white py-2 rounded-lg mt-5'>Sign Up</button>
            )}
          </form>

          <div className='mt-6 grid grid-cols-3 items-center text-gray-400'>
            <hr className='border-gray-400' />
            <p className='text-center text-sm font-medium'>OR</p>
            <hr className='border-gray-400' />
          </div>

          <button className='bg-gray-200 hover:bg-gray-300 duration-300 rounded-lg border py-2 w-full mt-5 flex justify-center items-center' onClick={handleGoogleLogin}>
            <img src={google} alt="google" className='w-6 h-6' />
            <span className='ml-1 text-sm'>Continue with Google</span>
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