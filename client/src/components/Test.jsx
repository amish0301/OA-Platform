import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft as LeftIcon, FaArrowRight as RightIcon } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../hooks/useAxios';
import { moveToNext, moveToPrevious, reset } from '../redux/slices/questionSlice';
import { resetResult, setIsLoading } from '../redux/slices/resultSlice';
import Loader from './Loader';
import Questions from './Questions';

const Test = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { result, isLoading } = useSelector(state => state.result);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsTestSubmitted(true);
    // somehow test not submitting

    setIsLoading(true);
    const toastId = toast.loading('Submitting test...');
    try {
      const { data } = await axiosInstance.post(`/user/submit/${id}`, { result }, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (data.success) {
        toast.update(toastId, { render: data.message, type: 'success', isLoading: false, autoClose: 600 });
        dispatch(reset());
        dispatch(resetResult());
      }
    } catch (error) {
      toast.update(toastId, { render: error.response.data.message, type: 'error', isLoading: false, autoClose: 2000 });
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
    }
  }

  useEffect(() => {
    function cleanUp() {
      document.removeEventListener('keydown', keyboardEvent);
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }

    function keyboardEvent(e) {
      if (e.key === 'ArrowLeft') {
        dispatch(moveToPrevious());
      }
      if (e.key === 'ArrowRight') {
        dispatch(moveToNext());
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
        } else {
          toast.info('Please press F11 to enter full screen mode. otherwise your test will not be submitted', { autoClose: 4000 });
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

  useEffect(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [id]);

  if (isLoading) return <Loader show={isLoading} size={40} />

  return (
    <div className='min-h-screen bg-[#f5f5f5] w-full'>
      <h1 className='text-3xl font-semibold text-center py-2'>Test</h1>

      {/* render questions */}
      <Questions testId={id} />

      <div className='block text-center space-x-5 mt-10'>
        <Button aria-placeholder='prev question' variant='contained' sx={{ marginInline: 'auto', paddingBlock: '.8rem' }} onClick={() => dispatch(moveToPrevious())} ><LeftIcon className='scale-150' /></Button>
        <Button aria-placeholder='prev question' variant='contained' sx={{ marginInline: 'auto', paddingBlock: '.8rem' }} onClick={() => dispatch(moveToNext())} ><RightIcon className='scale-150' /></Button>
      </div>

      <div className='mt-10 w-fit ml-auto mr-20'>
        <button className='py-3 text-lg mt-10 px-6 bg-blue-800 text-white font-semibold rounded-lg shadow-md shadow-black/50 hover:bg-blue-600 hover:transition-colors duration-300' onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Test;