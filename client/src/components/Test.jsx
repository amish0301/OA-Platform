import { Button } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft as LeftIcon, FaArrowRight as RightIcon } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../hooks/useAxios';
import { setIsSubmitting } from '../redux/slices/misc';
import { moveToNext, moveToPrevious, reset } from '../redux/slices/questionSlice';
import { resetResult, setIsLoading } from '../redux/slices/resultSlice';
import { AlertDialog } from '../shared/Alertdialog';
import Loader from './Loader';
import Questions from './Questions';

const Test = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { result, isLoading } = useSelector(state => state.result);
  const { totalExamTime } = useSelector(state => state.question);
  const { isTestSubmitted } = useSelector(state => state.misc);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null)
  const navigate = useNavigate();

  const enterFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enter fullscreen mode: ${err.message}`);
      });
    }
  };

  const handleSubmit = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();

    if (timeLeft <= 0) {
      toast.info("Times Up! Your test will be submitted automatically.");
      submitTest();
    } else {
      setIsAlertOpen(true);
      dispatch(setIsSubmitting(true));
    }
  }, [dispatch, timeLeft]);

  const handleFullscreenChange = useCallback(() => {
    if (!document.fullscreenElement && !isTestSubmitted && !isAlertOpen) {
      const userConfirmed = window.confirm(
        "You must stay in full screen mode during the exam. Click OK to re-enter full screen mode."
      );
      if (userConfirmed) {
        enterFullscreen();
      } else {
        toast.info("Please press F11 to re-enter full screen.", { autoClose: 4000 });
      }
    }
  }, [isTestSubmitted, isAlertOpen]);

  // set time only when totalExamTime is available
  useEffect(() => {
    if (totalExamTime && timeLeft === null) {
      setTimeLeft(totalExamTime);
    }
  }, [totalExamTime, timeLeft]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          return 0; // Time's up
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, handleSubmit]);

  useEffect(() => {
    if(!document.fullscreenElement) enterFullscreen();
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  useEffect(() => {
    const updateTestStart = async () => {
      try {
        await axiosInstance.post(`/user/start-test/${id}`, { startAt: new Date() });
      } catch (error) {
        console.error(`Error starting test: ${error.message}`);
      }
    };

    updateTestStart();

    return () => {
      dispatch(resetResult());
      dispatch(reset());
    };
  }, [id, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") dispatch(moveToPrevious());
      if (e.key === "ArrowRight") dispatch(moveToNext());
      if (e.key === "Enter" && !isAlertOpen) handleSubmit();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, handleSubmit, isAlertOpen]);

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

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = (Math.floor(time / 60) % 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  if (isLoading) return <Loader show={isLoading} />

  return (
    <div className='min-h-screen bg-[#f5f5f5] w-full'>
      <h1 className='text-3xl font-semibold text-center py-2'>Test</h1>

      {/* render timer */}
      <div className="ml-auto w-fit mr-20 bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold text-gray-700">Time Left:</h2>
          <p className="text-xl font-bold text-red-500 ml-2">{formatTime(timeLeft)}</p>
        </div>
      </div>
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