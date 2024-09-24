import React, { useEffect, useState } from 'react'
import { useFetchQuestion } from '../hooks/useFetchQuestion';
import Loader from './Loader';
import { useDispatch, useSelector } from 'react-redux';
import { updateResult } from '../redux/slices/resultSlice';
import { setQuestions } from '../redux/slices/questionSlice';

const Questions = ({ testId }) => {

    const { isLoading, data, isError } = useFetchQuestion({ testId });
    const dispatch = useDispatch();

    // setting up questions
    const { trace: questionNo, queue: questions } = useSelector(state => state.question);

    // questionNo, option is 1 based
    // result is 0 based (bcoz of array)
    const selectedOption = useSelector(state => state.result.result[questionNo - 1]);

    const [selected, setSelected] = useState(selectedOption || false);
    const handleOptionSelect = (index) => {
        setSelected(index);
        dispatch(updateResult({ questionNo, selected: index }));
    }

    useEffect(() => {
        setSelected(selectedOption);
    }, [selectedOption])

    useEffect(() => {
        if (data) {
            dispatch(setQuestions(data));
        }
    }, [data])

    if (isLoading) return <Loader show={isLoading} size={40} />
    if (isError) return <h3>{isError || "Unknown Error"}</h3>

    return (
        <div className='container w-full select-none px-10 py-5'>
            <div className='container w-ful rounded-lg bg-[#e5e5e5] p-10 text-[#333333]'>
                <h3 className='text-xl my-3'>{`${questionNo}. ${questions[questionNo-1]?.question}`}</h3>
                <ul className='list-inside'>
                    {
                        questions[questionNo-1]?.options?.map((option, index) => {
                            return (
                                <div className='flex items-center justify-start gap-2 w-fit ml-2' key={index}>
                                    <input type="radio" name={`question${questionNo}`} checked={selected == index + 1} value={option} aria-label='option-input' id={`option${index}`} key={option} className='w-4 h-4' onChange={() => handleOptionSelect(index + 1)} />
                                    <label htmlFor={`option${index}`} className='font-normal my-2 pl-2 cursor-pointer'>{option}</label>
                                </div>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default Questions