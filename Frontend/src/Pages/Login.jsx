import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "candidate"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const Handle_Login_Submit = (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.email === formData.email) {
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userRole", formData.role);
      
      if (formData.role === 'recruiter') {
        navigate("/recruiter-dashboard");
      }
      else {
        navigate("/candidate-dashboard");
      }
    } 
    else {
      alert('Invalid credentials or role mismatch');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300">
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-3xl shadow-md md:mt-15 
        md:mb-5 overflow-y-auto'>
        <div className='flex justify-center'>
          <FaLock className="text-white bg-blue-500 w-10 h-8 rounded-2xl"/>
        </div>

        <h2 className='text-3xl underline text-center font-bold'> Welcome Back </h2>
        <p className='text-center text-gray-600'> LogIn to your Recruiter-AI account! </p>
        <form className='space-y-6' onSubmit={Handle_Login_Submit}>
          <div>
            <label className='text-md block mb-1 font-bold'> Email Address: </label>
            <div className="flex border items-center px-3 py-2 rounded">
              <FaEnvelope className='text-blue-600 mr-2' />
              <input type="email" name="email" placeholder='Enter your email here....' className='w-full border-0 outline-none'
                value={formData.email} onChange={handleChange} required
              />
            </div>
          </div>

          <div>
            <label className='text-md block mb-1 font-bold'> Password: </label>
            <div className="flex border items-center px-3 py-2 rounded">
              <FaLock className='text-blue-600 mr-2' />
              <input type="password" name="password" placeholder='Enter your password here....' className='w-full border-0 
                outline-none' required />
            </div>
          </div>

          <div>
            <label className='text-md block mb-1 font-bold'> Role: </label>
            <div className="flex border items-center px-3 py-2 rounded">
              <select name="role" className='w-full border-0 outline-none' value={formData.role} onChange={handleChange} required>
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
          </div>

          <button type='submit' className='w-30 ml-30 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2
            rounded-3xl cursor-pointer font-bold hover:font-extrabold'> LogIn 
          </button>
        </form>

        <p className='text-center text-md'> Don't have an account? &nbsp;
          <Link to="/signup" className='text-blue-500 hover:underline cursor-pointer active:font-bold
            active:text-red-500' >
            Signup
          </Link> 
        </p>
      </div>
    </div>
  )
}
export default Login;