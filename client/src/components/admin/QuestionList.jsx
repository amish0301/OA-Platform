import { Checkbox } from '@mui/material';
import React from 'react';

const QuestionList = ({ questions = [], isPreview = false, isEdit = false, deleteQuestionList = [], handleCheckboxChange = [], }) => {
    return (
        <div>
            {
                questions?.map((q, index) => (
                    <div className={`flex flex-col ${isPreview ? 'my-2' : ''}`}>
                        <div key={index} className='flex items-center justify-start'>
                            <p className='text-lg'>{index + 1}.</p>
                            <p className='text-lg text-[#555] text-justify font-medium ml-2'>{q.question}</p>
                            {isEdit && <Checkbox checked={deleteQuestionList?.includes(q._id)} onChange={(e) => handleCheckboxChange(q._id, e.target.checked)} />}
                        </div>
                        {
                            (isPreview) && q.options?.map((o, index) => (
                                <div key={index} className='flex items-center justify-start ml-5'>
                                    <div className='flex items-center mr-2'>
                                        <input type="checkbox" readOnly className='rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200' checked={q.answer == index + 1} />
                                        <p className='text-lg text-[#555] text-justify font-medium ml-2'>{o}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
            {
                !questions && <p>No questions found</p>
            }
        </div>
    )
}

export default QuestionList