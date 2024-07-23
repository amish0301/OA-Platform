import React from 'react'

const Loader = ({ show }) => {
  return (
    show && (<div className='container m-auto'>
      <h1>Loading...</h1>
    </div>)
  )
}

export default Loader