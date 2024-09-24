import React from 'react'

const Loader = ({ show, size = 40, color = "#3a1c71" }) => {
  if (!show) return null;

  const cssOverride = {
    width: `${size}px`,
    height: `${size}px`,
    borderColor: '#f3f3f3',
    borderTopColor: color,
  }

  return (
    <div className="flex justify-center items-center h-screen bg-white bg-opacity-80">
      <div className="rounded-full animate-spin" style={cssOverride}></div>
    </div>
  );
}

export default Loader