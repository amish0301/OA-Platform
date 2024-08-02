import { Button } from '@mui/material';
import { FaArrowLeft as LeftIcon, FaArrowRight as RightIcon } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import Questions from './Questions';
import { useDispatch, useSelector } from 'react-redux';
import { moveToNext, moveToPrevious, reset } from '../redux/slices/questionSlice';
import { resetResult } from '../redux/slices/resultSlice';
import { toast } from 'react-toastify';

const Test = () => {
  const dispatch = useDispatch();
  const { result } = useSelector(state => state.result);   // result array choose by user
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  const handleNextQuestion = () => {
    dispatch(moveToNext())
  }

  const handlePrevQuestion = () => {
    dispatch(moveToPrevious())
  }

  const handleSubmit = () => {
    console.log(result);

    document.exitFullscreen();
    toast.success("Test Submitted");
    setIsTestSubmitted(true);
    dispatch(resetResult());
    dispatch(reset());
    return () => cleanUp();
  }

  useEffect(() => {
    function cleanUp() {
      document.removeEventListener('keydown', keyboardEvent);
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }

    function keyboardEvent(e) {
      if (e.key === 'ArrowLeft') {
        handlePrevQuestion();
      }
      if (e.key === 'ArrowRight') {
        handleNextQuestion();
      }
      if (e.key === 'Enter') {
        handleSubmit();
      }
    }

    async function openFullScreen() {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error(`Error attempting to enter fullscreen mode: ${err.message}`);
      }
    }

    async function handleFullscreenChange() {
      if (!document.fullscreenElement && !isTestSubmitted) {
        const userConfirmed = window.confirm('You must stay in full screen mode during the Exam. Click OK to re-enter full screen mode.');
        if (userConfirmed) {
          await openFullScreen();
        }else {
          toast.info('Please press F11 to enter full screen mode. otherwise your test will not be submitted');
        }
      }
    }

    // Add event listeners for keyboard events and fullscreen change
    document.addEventListener('keydown', keyboardEvent);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    if (!document.fullscreenElement) openFullScreen();

    // Clean up event listeners when the component unmounts
    return () => cleanUp();
  }, [isTestSubmitted]);

  return (
    <div className='min-h-screen bg-[#f5f5f5] w-full'>
      <h1 className='text-3xl font-semibold text-center py-2'>Test</h1>

      {/* render questions */}
      <Questions />

      <div className='block text-center space-x-5 mt-10'>
        <Button aria-placeholder='prev question' variant='contained' sx={{ marginInline: 'auto', paddingBlock: '.8rem' }} onClick={handlePrevQuestion} ><LeftIcon className='scale-150' /></Button>
        <Button aria-placeholder='prev question' variant='contained' sx={{ marginInline: 'auto', paddingBlock: '.8rem' }} onClick={handleNextQuestion} ><RightIcon className='scale-150' /></Button>
      </div>

      <div className='mt-10 w-fit ml-auto mr-20'>
        <button className='py-3 text-lg mt-10 px-6 bg-blue-800 text-white font-semibold rounded-lg shadow-md shadow-black/50 hover:bg-blue-600 hover:transition-colors duration-300' onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Test;