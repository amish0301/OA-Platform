import { Button } from '@mui/material';
import { FaArrowLeft as LeftIcon, FaArrowRight as RightIcon } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import Questions from './Questions';
import { useDispatch, useSelector } from 'react-redux';
import { moveToNext, moveToPrevious } from '../redux/slices/questionSlice';

const Test = () => {
  const dispatch = useDispatch();
  // const result = useSelector(state => state.result.result);   // result array choose by user
  // const questionNo = useSelector(state => state.question.trace);  // finding question no

  const handleNextQuestion = () => {
    dispatch(moveToNext())
  }

  const handlePrevQuestion = () => {
    dispatch(moveToPrevious())
  }

  return (
    <div className='container min-h-screen'>
      <h1 className='text-3xl font-semibold'>Test</h1>

      {/* render questions */}
      <Questions />

      <div className='block text-center space-x-5 mt-10'>
        <Button aria-placeholder='prev question' variant='contained' sx={{ marginInline: 'auto', paddingBlock: '.8rem' }} onClick={handlePrevQuestion} ><LeftIcon className='scale-150' /></Button>
        <Button aria-placeholder='prev question' variant='contained' sx={{ marginInline: 'auto', paddingBlock: '.8rem' }} onClick={handleNextQuestion} ><RightIcon className='scale-150' /></Button>
      </div>
    </div>
  );
};

export default Test;