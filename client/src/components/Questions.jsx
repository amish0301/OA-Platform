import React, { useEffect, useState } from 'react'
import { useFetchQuestion } from '../hooks/useFetchQuestion';
import Loader from './Loader';
import { useDispatch, useSelector } from 'react-redux';
import { updateResult } from '../redux/slices/resultSlice';

const Questions = () => {

    const { isLoading, data, isError } = useFetchQuestion();
    const dispatch = useDispatch();

    // fetching questions info
    const node = useSelector(state => state.question);
    const questionNo = node.trace;
    const questions = node.queue[questionNo];

    const selectedOption = useSelector(state => state.result.result[questionNo]);

    const [selected, setSelected] = useState(selectedOption || false);
    const handleOptionSelect = (index) => {
        setSelected(index);
        dispatch(updateResult({ questionNo, selected: index }));
    }

    useEffect(() => {
        setSelected(selectedOption);
    }, [selectedOption])

    if (isLoading) return <Loader show={isLoading} />
    if (isError) return <h3>{isError || "Unknown Error"}</h3>

    return (
        <div className='container w-full select-none'>
            <div className='py-3 bg-green-300 w-full'>
                <h3 className='text-xl my-3'>{`${questionNo + 1}. ${questions?.question}`}</h3>
                <ul className='list-inside' key={questionNo}>
                    {
                        questions?.options?.map((option, index) => {
                            return (
                                <div className='flex items-center justify-start gap-2 w-fit'>
                                    <input type="radio" name={`question${questionNo}`} checked={selected == index} value={option} aria-label='option-input' id={`option${index}`} key={option} className='w-4 h-4' onChange={() => handleOptionSelect(index)} />
                                    <label htmlFor={`option${index}`} className='font-normal mx-2 cursor-pointer'>{option}</label>
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