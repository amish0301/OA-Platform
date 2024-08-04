import React from 'react';
import notFoundImg from '../assets/404.png';

const NotFound = () => {
  return (
    <div className='min-h-screen flex items-center px-20 bg-[#f9fafe]'>
      <div className='w-1/2 hidden md:block ml-20'>
        <img src={notFoundImg} alt="404Page" className='object-cover h-50' />
      </div>
      <div className='w-full md:w-1/2 flex-col items-start space-y-2'>
        <div>
          <h1 className='text-6xl font-semibold'>Oops,</h1>
          <h2 className='text-5xl font-semibold leading-relaxed'><span className='text-blue-600'>nothing</span> here...</h2>
        </div>
        <div>
          <p className='font-light text-lg'>Uh oh, we can't seem to find the page you're looking for.</p>
          <p className='text-lg font-light'>Try going back to previous page or return to Homepage by clicking on below button</p>
        </div>
        <div>
          <button className='py-2 text-lg mt-10 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md shadow-black/50 hover:bg-blue-800 hover:transition-colors duration-300' onClick={() => window.location.pathname = '/'}>Go Back</button>
        </div>
      </div>
    </div>
  )
}

export default NotFound