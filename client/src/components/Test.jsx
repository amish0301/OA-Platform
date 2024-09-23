import { Button } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft as LeftIcon, FaArrowRight as RightIcon } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../hooks/useAxios';
import { moveToNext, moveToPrevious, reset } from '../redux/slices/questionSlice';
import { resetResult, setIsLoading } from '../redux/slices/resultSlice';
import { AlertDialog } from '../shared/Alertdialog';
import Loader from './Loader';
import Questions from './Questions';
import { setIsSubmitting } from '../redux/slices/misc';

const Test = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { result, isLoading } = useSelector(state => state.result);
  const { isTestSubmitted, isSubmitting } = useSelector(state => state.misc);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    setIsAlertOpen(true);
    dispatch(setIsSubmitting(true));
  }, [dispatch]);

  const handleFullscreenChange = useCallback(async () => {
    if (!document.fullscreenElement && !isTestSubmitted && !isSubmitting && !isAlertOpen) {
      const userConfirmed = window.confirm('You must stay in full screen mode during the Exam. Click OK to re-enter full screen mode.');
      if (userConfirmed) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          console.error(`Error attempting to enter fullscreen mode: ${err.message}`);
        }
      } else {
        toast.info('Please press F11 to enter full screen mode. Otherwise your test will not be submitted', { autoClose: 4000 });
      }
    }
  }, [isTestSubmitted, isAlertOpen]);

  useEffect(() => {
    const keyboardEvent = (e) => {
      if (e.key === 'ArrowLeft') dispatch(moveToPrevious());
      if (e.key === 'ArrowRight') dispatch(moveToNext());
      if (e.key === 'Enter' && !isAlertOpen) handleSubmit();
    };

    document.addEventListener('keydown', keyboardEvent);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    if (!document.fullscreenElement && !isTestSubmitted && !isAlertOpen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enter fullscreen mode: ${err.message}`);
      });
    }

    return () => {
      document.removeEventListener('keydown', keyboardEvent);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [dispatch, handleSubmit, handleFullscreenChange, isTestSubmitted, isAlertOpen]);

  useEffect(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    return () => {
      dispatch(resetResult());
      dispatch(reset());
    }
  }, [id]);

  // Update start time
  useEffect(() => {
    const updateTestStart = async () => {
      try {
        await axiosInstance.post(`/user/start-test/${id}`, { startAt: new Date() });
      } catch (error) {
        throw error
      }
    }

    updateTestStart()
  }, [])

  const submitTest = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Submitting test...');
    const payload = { resultArray: [...result] }
    try {
      const { data } = await axiosInstance.post(`/user/submit/${id}`, payload);
      if (data.success) {
        toast.update(toastId, { render: data.message, type: 'success', isLoading: false, autoClose: 1000 });
        navigate(`/test/${id}/result`, { replace: true });
      }
    } catch (error) {
      toast.update(toastId, { render: error.response.data.message, type: 'error', isLoading: false, autoClose: 1500 });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader show={isLoading} />

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
      <AlertDialog open={isAlertOpen} setIsAlertOpen={setIsAlertOpen} submitTest={submitTest} />
    </div>
  );
};

export default Test;