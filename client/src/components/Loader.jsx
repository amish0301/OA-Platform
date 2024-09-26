import React from 'react'

const Loader = ({ show, size = 40, color = "#3a1c71" }) => {
  if (!show) return null;

  const cssOverride = {
    width: `${size}px`,
    height: `${size}px`,
    border: '3px solid #f3f3f3',
    borderTop: `5px solid ${color}`,
    borderRadius: '50%',
  }

  return (
    <div className="flex justify-center items-center h-screen bg-transparent">
      {/* The spinning loader */}
      <div style={cssOverride} className='animate-spin'></div>
    </div>
  );
}

export default Loader

