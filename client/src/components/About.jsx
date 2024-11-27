import React from 'react';

const About = () => {
  return (
    <div className="max-h-screen py-10 md:py-20 bg-gray-50 text-gray-800 px-2">
      <div className="max-w-4xl pl-8 md:pl-20">
        {/* Header */}
        <h1 className="text-4xl font-bold text-blue-600 mb-10 text-left">
          About Our Online Assessment Platform
        </h1>
        <p className="text-lg text-gray-600 mb-10 text-left">
          Welcome to our online assessment platform! Our mission is to empower individuals and organizations with seamless tools for conducting and analyzing assessments. Designed with simplicity and efficiency in mind, our platform ensures a smooth experience for all users.
        </p>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-fit">
          <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-4">User-Friendly</h2>
            <p className="text-sm text-gray-600">
              Intuitive design that makes assessments easy to create, take, and analyze.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-4">Customizable</h2>
            <p className="text-sm text-gray-600">
              Fully customizable assessments tailored to meet diverse requirements.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-4">Secure & Reliable</h2>
            <p className="text-sm text-gray-600">
              Advanced security measures to protect data and ensure integrity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;