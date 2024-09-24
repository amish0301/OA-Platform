import React from 'react'

const Loader = ({ show, size = 40, color = "#3a1c71" }) => {
  if (!show) return null;

  const cssOverride = {
    width: `${size}px`,
    height: `${size}px`,
    border: '3px solid #f3f3f3',
    borderTop: `5px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 0.4s linear infinite',
  }

  return (
    <div className="flex justify-center items-center h-screen bg-transparent">
      <div className="relative flex flex-col items-center">
        {/* The spinning loader */}
        <div style={cssOverride}>
        </div>
        <p className="text-black font-bold mt-2 animate-pulse text-lg">
          Loading...
        </p>

      </div>
    </div>
  );
}

export default Loader

