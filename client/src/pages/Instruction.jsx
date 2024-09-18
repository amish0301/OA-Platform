import React, { useState } from 'react'
import { FaArrowUpRightFromSquare as Icon } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';

const instructionList = [
  {
    id: 1,
    title: 'Read All Questions Carefully',
    desc: 'Ensure you understand each question before answering.'
  },
  {
    id: 2,
    fitle: 'Time Management',
    desc: 'Use your time wisely. Try to answer all questions in one sitting.'
  },
  {
    id: 3,
    title: 'No External Assistance',
    desc: ' Do not use any books, notes, or online resources. This exam is to be completed individually without any external help.'
  },
  {
    id: 4,
    title: 'Technical Requirements',
    desc: 'Ensure your device is fully charged and connected to a stable internet connection. Use a modern browser like Chrome, Firefox, or Safari.'
  },
  {
    id: 5,
    title: 'Browser Behavior',
    desc: 'Do not refresh the browser, navigate away from the exam page, or close the browser window during the exam. Doing so may result in your exam being terminated.'
  },
  {
    id: 6,
    title: 'Tab Change Warning',
    desc: 'If you switch tabs or applications during the exam, you will receive a warning. Repeated tab changes may result in automatic termination of the exam.'
  },
  {
    id: 7,
    title: 'Submit Answers',
    desc: 'Make sure to submit your answers within the given time. Any answers not submitted will not be counted.'
  },
  {
    id: 8,
    title: 'Review Before Submitting',
    desc: 'You have the opportunity to review and change your answers before the final submission. Once submitted, no changes can be made.'
  },
  {
    id: 9,
    title: 'Technical Issues',
    desc: 'In case of any technical difficulties, contact support immediately at yourprep@gmail.com.'
  },
  {
    id: 10,
    title: 'Privacy and Integrity',
    desc: 'Your activities during the exam may be monitored to ensure compliance with the exam rules.'
  },
  {
    id: 11,
    title: 'Start the Exam',
    desc: 'Click the "Start Exam" button below when you are ready to begin. The timer will start immediately after clicking.'
  }
]

const Instruction = () => {
  const [instructionRead, setInstructionRead] = useState(false);
  const location = window.location.pathname === '/instruction';
  const navigate = useNavigate();

  const { id } = useParams();


  return (
    <section className='min-h-screen max-w-full bg-[#f6f6f6] p-12'>
      <div className='flex flex-col gap-2 items-start justify-left mx-14'>
        <h1 className='text-4xl font-bold text-[#383838]'>Test Instruction</h1>
        <p className='text-base text-red-700 tracking-wide font-semibold'>Read all the instruction carefully <span className='text-blue-600 font-semibold'>before you start</span> the test.</p>
      </div>

      <div className='max-w-screen-xl mt-5 flex-col items-center mx-14 p-5 rounded-lg bg-[#f3f8fc] hover:shadow-xl transition-shadow duration-300 ease-in-out'>
        {
          instructionList.map(({ id, title, desc }) => (
            <div key={id} className='flex items-start gap-2 py-2 w-full'>
              <span className='font-bold font-poppins'>{id}.</span>
              <p className='text-md tracking-wide text-gray-500 font-semibold'>{desc}</p>
            </div>
          ))
        }
      </div>

      {!location && <>
        <div className='mt-3 mx-16'>
          <label htmlFor="instruction-read" className='flex items-center justify-left cursor-pointer'>
            <input type="checkbox" id="instruction-read" className='w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500' onChange={() => setInstructionRead(!instructionRead)} />
            <span className='text-sm font-medium ml-2 select-none'>I have read and understood the instruction</span>
          </label>
        </div>

        <button className={`bg-[#1c4980] hover:bg-[#2a558a] font-semibold text-[16px] hover:border-none text-white mt-3 py-3 px-7 mx-auto flex items-center rounded-lg ${!instructionRead ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} onClick={() => navigate(`/test/${id}/start`)}>
          Start Exam
          <Icon className='ml-2 text-sm hover:translate-x-1 transition-all duration-300' />
        </button>
      </>
      }
    </section>
  )
}

export default Instruction