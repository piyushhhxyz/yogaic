import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/user-data/user123')
      .then(response => response.json())
      .then(data => setUserData(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const renderCalendar = () => {
    const daysInMonth = 35; // 5 weeks
    const today = new Date().getDate();
    return (
      <div className="grid grid-cols-7 gap-2 mt-6">
        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const isActive = userData?.sessions.some(session => new Date(session.date).getDate() === day);
          const isToday = day === today;
          return (
            <div 
              key={index} 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm
                ${isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Morning Ritual or Deep Work?</h1>
        <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <p className="text-center text-gray-600 mb-8">Choose between the two primary options for your practice.</p>

      <div className="space-y-4 mb-12">
        <Link to="/ritual/morning" className="block w-full py-4 px-6 bg-blue-500 text-white font-semibold rounded-full text-center hover:bg-blue-600 transition duration-300 shadow-md">
          Start Morning Ritual
        </Link>
        <Link to="/ritual/deep-work" className="block w-full py-4 px-6 bg-gray-200 text-gray-800 font-semibold rounded-full text-center hover:bg-gray-300 transition duration-300 shadow-md">
          Start Deep Work Ritual
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          Your Streaks <span className="ml-2">🔥</span>
        </h2>
        <p className="text-5xl font-bold text-orange-500 mb-4">{userData?.currentStreak || 0}</p>
        {renderCalendar()}
      </div>

      <motion.div 
        className="text-center text-gray-500 mt-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Keep up the good work!
      </motion.div>
    </div>
  );
};

export default HomePage;