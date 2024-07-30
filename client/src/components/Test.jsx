import { Button } from '@mui/material';
import { FaArrowLeft as LeftIcon, FaArrowRight as RightIcon } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import Questions from './Questions';
import { useDispatch, useSelector } from 'react-redux';
import { moveToNext, moveToPrevious } from '../redux/slices/questionSlice';
import { setResult } from '../redux/slices/resultSlice';

const Test = () => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(undefined);
  const result = useSelector(state => state.result.result);   // result array choose by user
  const questionNo = useSelector(state => state.question.trace);  // finding question no

  const handleNextQuestion = () => {
    dispatch(moveToNext())
    if(questionNo >= result.length - 1){
      // i'll call setresult
      dispatch(setResult(checked))
    }
  }

  useEffect(() => {
    console.log("result", result);
  })

  const handlePrevQuestion = () => {
    dispatch(moveToPrevious())
  }

  const onChecked = (index) => {
    setChecked(index);
  }

  return (
    <div className='container min-h-screen'>
      <h1 className='text-3xl font-semibold'>Test</h1>

      {/* render questions */}
      <Questions onChecked={onChecked} />

      <div className='grid grid-cols-2 gap-4'>
        <Button aria-placeholder='prev question' variant='contained' sx={{ marginLeft: 'auto', paddingBlock: '.8rem' }} onClick={handlePrevQuestion} ><LeftIcon className='scale-150' /></Button>
        <Button aria-placeholder='prev question' variant='contained' sx={{ marginRight: 'auto', paddingBlock: '.8rem' }} onClick={handleNextQuestion} ><RightIcon className='scale-150' /></Button>
      </div>
    </div>
  );
};

export default Test;