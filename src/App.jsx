import React from 'react'
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Jobs from './Pages/Jobs';
import Application from './Pages/Application';
import Dashboard from './Pages/Dashboard';
import JobDetailsPage from './Pages/JobsDetailsPage';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/jobs/:id' element={<JobDetailsPage />} />
        <Route path='/dashboard' element={< Dashboard />} />
        <Route path='/applications' element={<Application />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;