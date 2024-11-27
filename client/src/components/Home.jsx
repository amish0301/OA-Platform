import React from 'react';
import { BsFillQuestionSquareFill as QuestionIcon } from "react-icons/bs";
import { FaQuoteLeft as QuoteIcon, FaArrowRightLong as RightIcon } from "react-icons/fa6";
import { GrDocumentTest as TestIcon } from "react-icons/gr";
import { IoAnalyticsSharp as AnalyticsIcon } from "react-icons/io5";

export const ServiceCard = ({ title, desc, icon, type }) => {
  return (
    <div className={`flex flex-col items-start  p-4 ${type === 'testimonial' ? 'max-w-md' : 'max-w-sm'} shadow-md shadow-zinc-300 ${type === 'testimonial' ? 'bg-gray-100' : 'bg-blue-100'} rounded-lg`}>
      {/* render quote icon */}
      {type === 'testimonial' ? <QuoteIcon className='text-3xl text-gray-700' /> :
        <div className='w-14 h-14 rounded-lg flex items-center justify-center bg-blue-600 text-white'>
          <span className='text-3xl'>{icon}</span>
        </div>
      }
      <h3 className='text-xl font-semibold my-2'>{title}</h3>
      <p className='text-sm mt-1 text-gray-700 leading-normal'>{desc}</p>

      {type === 'testimonial' && <div className='mt-10 w-full flex items-center justify-items-start'>
        <img src="https://i.pravatar.cc/300" alt="profile" className='w-14 h-14 rounded-full' />
        <div className='ml-4 flex-col'>
          <h3 className='text-base font-bold text-purple-950'>Amish Pithva</h3>
          <p className='text-sm text-gray-700'>Student</p>
        </div>
      </div>}
    </div>
  )
}

const cardDetails = [
  {
    title: 'Live Tests',
    desc: 'Register for the Exam you want to appear by securely. You can resgister in single click for the exam of your choice from dashboard.',
    icon: <TestIcon />
  },
  {
    title: 'High Yield Questions',
    desc: 'Take the test on time, you can take the missed test from dashboard. Live exams link appears only when the exam is live.',
    icon: <QuestionIcon />
  },
  {
    title: 'Live Tests',
    desc: 'Dashboard is true sense that help you analyze you performance. Everything you do at one place. your real preparations pla.',
    icon: <AnalyticsIcon />
  }
]

const testimonials = [
  {
    title: 'This was an amazing experience!',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore, enim ratione cum magnam mollitia saepe voluptatum necessitatibus aspernatur laboriosam quam, eveniet, laborum illo soluta tenetur fuga laudantium delectus eaque possimus.'
  },
  {
    title: 'This was an amazing experience!',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore, enim ratione cum magnam mollitia saepe voluptatum necessitatibus aspernatur laboriosam quam, eveniet, laborum illo soluta tenetur fuga laudantium delectus eaque possimus.'
  }
]

const Home = () => {
  return (
    <>
      <div className='w-full min-h-screen px-5 md:px-14 gap-10 flex items-center'>
        <div className='w-full md:w-1/2 pl-5 md:mb-32'>
          <h1 className='text-2xl md:text-4xl py-2 text-wrap font-semibold leading-snug'>Welcome to <span className='text-blue-600'>YourPrepPartner.</span> <br /> Prepare with confidence!</h1>
          <p className='text-sm font-bold mt-2'>Excel every exam with our high yield <span className='text-blue-600'>MCQ's.</span></p>

          {/* test button */}
          <button className='flex items-center gap-2 text-lg mt-14 py-3 px-10 bg-blue-600 text-white font-semibold rounded-lg shadow-md shadow-black/50 hover:bg-blue-800 hover:transition-colors duration-300' onClick={() => window.open('/test/assigned', '_self')}>Give Test
            <RightIcon className='text-lg mt-1 hover:translate-x-2 duration-300' />
          </button>
        </div>
        <div className='hidden md:block w-1/2 px-10'>
          <img src="https://png.pngtree.com/png-vector/20220615/ourmid/pngtree-online-testing-background-vector-illustration-with-checklist-png-image_5084763.png" alt="hero_img" className='w-full mb-32' />
        </div>
      </div>

      {/* Home-2 */}
      <div className='px-6 md:px-20 flex flex-col justify-between gap-4 bg-[#f6f6f6]'>
        <h2 className='text-3xl md:text-4xl pt-5 font-semibold font-poppins text-[#383838]'>What We Offer?</h2>
        <div className='grid w-full grid-cols-1 md:grid-cols-3 gap-10 py-10'>
          {
            cardDetails.map((card, index) => <ServiceCard key={index} {...card} />)
          }
        </div>
      </div>

      {/* Home - 3 */}
      <div className="w-full px-10 md:px-20 py-5 md:py-10">
        <div className="flex items-center gap-2 md:gap-4">
          <h2 className="text-2xl md:text-4xl my-5 font-semibold font-poppins text-[#383838] flex-shrink-0">
            Our Testimonials
          </h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2013/2013639.png"
            alt="testimonial_icons"
            className="w-8 h-8 md:w-12 md:h-12 mb-0 md:mb-5"
          />
        </div>
        <p className="text-base mt-2 max-w-xl font-semibold text-gray-700 leading-normal">
          We don't like to brag, but we don't mind letting our students do it for us. Here are a few nice things folks said about our services over the years.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 my-10 md:my-14">
          {testimonials.map((card, index) => (
            <ServiceCard key={index} {...card} type="testimonial" />
          ))}
        </div>
      </div>

    </>
  )
}

export default Home