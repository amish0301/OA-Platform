import React, { useState } from 'react'
import { GoEyeClosed as Closed, GoEye as Open } from "react-icons/go";
import google from '../assets/google.png'
import sideImg from '../assets/learning.jpg'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  document.title = 'Login | Online Assessment';
  const navigate = useNavigate();

  const [eyeOpen, setEyeOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className='bg-gray-50 min-h-screen flex items-center justify-center'>
      <div className='bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl w-full p-5 items-center'>
        <div className='md:w-1/2 md:px-12 px-8 py-2'>
          {isLogin ? <p className='text-3xl font-bold text-[#002D74]'>Login</p> : <p className='text-3xl font-bold text-[#002D74]'>Signup</p>}
          {isLogin && <p className='text-xs font-medium mt-4 text-[#002D74]'>if you already have an account, easily <span className='text-black text-sm'>Login</span></p>}

          <form className='flex flex-col gap-4'>
            {!isLogin &&
              (<input type='text' className='p-2 mt-8 rounded-lg border' placeholder='enter your name' name='name' required />

              )
            }
            <input type="email" className={`p-2 ${isLogin ? 'mt-8' : ''} rounded-lg border`} placeholder='email' name='email' required />
            <div className='relative'>
              <input type={`${eyeOpen ? 'text' : 'password'}`} className='p-2 rounded-lg border w-full' placeholder='password' name='password' required />
              <span className='text-lg absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer' onClick={() => setEyeOpen(prev => !prev)}>
                {eyeOpen ? <Open /> : <Closed />}
              </span>
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

          <button className='bg-gray-200 hover:bg-gray-300 duration-300 rounded-lg border py-2 w-full mt-5 flex justify-center items-center'>
            <img src={google} alt="google" className='w-6 h-6' />
            <span className='ml-1 text-sm'>Continue with Google</span>
          </button>

          <div className='mt-5 text-xs border-b py-4 border-gray-400 text-[#002D74] underline cursor-pointer' onClick={() => navigate('/auth/forget-password')}>Forget your Password?</div>
          <div className='mt-3 text-xs flex justify-between items-center'>
            {isLogin ? <p className='text-gray-400'>Don't have an account? <span className='text-blue-800 cursor-pointer hover:underline' onClick={() => setIsLogin(prev => !prev)}>Register</span></p> : <p className='text-gray-400'>Already have an account? <span className='text-blue-800 cursor-pointer hover:underline' onClick={() => setIsLogin(prev => !prev)}>Login</span></p>}
          </div>
        </div>

        {/* image */}
        <div className='md:block hidden w-1/2'>
          <img src={sideImg} alt="login_img" className='rounded-2xl' />
        </div>
      </div>
    </section>
  )
}

export default Login