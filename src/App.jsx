import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import RitualPage from './components/RitualPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ritual/:type" element={<RitualPage />} />
      </Routes>
    </Router>
  );
};

export default App;