import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RitualPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const ritualData = {
    morning: {
      title: 'Morning Yoga',
      subtitle: 'Yoga Studio',
      image: '/src/assets/player.png',
      description: 'Get ready for 15 minutes of guided yoga practice. Set up your mat and props, and let\'s get started.',
      audio: '/audios/morning-ritual.mp3'
    },
    'deep-work': {
      title: 'Deep Work Session',
      subtitle: 'Focus Studio',
      image: '/src/assets/player.png',
      description: 'Prepare for 90 minutes of focused deep work. Set up your workspace and eliminate distractions.',
      audio: '/audios/deep-working-ritual.mp3'
    },
  };

  const ritual = ritualData[type];

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleAudioEnd);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.pause();
    };
  }, []);

  const updateProgress = () => {
    const audio = audioRef.current;
    const percent = (audio.currentTime / audio.duration) * 100;
    setProgress(percent);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    completeSession();
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const completeSession = () => {
    fetch('http://localhost:5000/api/complete-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user123', ritualType: type, completed: true }),
    })
    .then(response => response.json())
    .then(() => navigate('/'))
    .catch(error => console.error('Error completing session:', error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Start {type === 'morning' ? 'Morning' : 'Deep Work'} Ritual</h1>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
          <motion.img
            src={ritual.image}
            alt={ritual.title}
            className="w-full h-80 object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-1">{ritual.title}</h2>
            <p className="text-gray-600 mb-4">{ritual.subtitle}</p>
            
            <div className="flex justify-between items-center mb-4">
              <button onClick={togglePlay} className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300">
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <div className="flex-grow mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-blue-500 h-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
            
            <audio ref={audioRef} src={ritual.audio} />
            
            <h3 className="text-xl font-semibold mb-2">Your ritual is about to begin</h3>
            <p className="text-gray-600 mb-6">{ritual.description}</p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition duration-300"
              onClick={completeSession}
            >
              Start Practice
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RitualPage;