import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Component/home';
import Login from './Component/login';
import Explore from './Component/explore';
import Contact from './Component/contact';
import History from './Component/history';
import Setting from './Component/settings'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;
