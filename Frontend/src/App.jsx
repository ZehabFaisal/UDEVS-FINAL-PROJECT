import React, { useEffect } from 'react';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Jobs from './Pages/Jobs';
import Application from './Pages/Application';
import Dashboard from './Pages/Dashboard';
import RecruiterDashboard from './Pages/RecruiterDashboard';
import CandidateDashboard from './Pages/CandidateDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import JobDetailsPage from './Pages/JobsDetailsPage';
import ProtectedRoute from './Components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { verifyAuth } from './store/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(verifyAuth());
    }
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/jobs/:id' element={<JobDetailsPage />} />

        <Route path='/dashboard' element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path='/recruiter-dashboard' element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } />
        
        <Route path='/candidate-dashboard' element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateDashboard />
          </ProtectedRoute>
        } />
        
        <Route path='/admin-dashboard' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path='/applications' element={
          <ProtectedRoute>
            <Application />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;