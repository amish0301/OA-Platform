import React from 'react'

const ResultBox = ({ qno, option }) => {
    return (
        <div className='border-2 border-gray-500 p-2 rounded-md overflow-hidden flex-wrap'>
            <div className='flex justify-center items-center px-3'>
                <p className='text-center text-lg font-bold'>{qno}</p>
                <p className='text-center text-lg font-bold'>-</p>
                <p className='text-center text-lg font-bold'>{option}</p>
            </div>
        </div>
    )
}

const Results = ({ dispatch, questions, isEdit = false }) => {

    return (
        <div className='flex flex-wrap gap-2 items-center justify-start mt-3 w-full'>
            {
                questions?.map((question, index) => <ResultBox key={index} qno={!isEdit ? question.id : index + 1} option={question.answer} />)
            }
        </div>
    )
}

export default Results