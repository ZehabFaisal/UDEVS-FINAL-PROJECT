import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("isAuth");
  const userEmail = localStorage.getItem("userEmail");

  const Handle_Logout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("userEmail");
    navigate("/login");
    setIsOpen(false);
  };
  
  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-2 flex justify-between items-center z-50">
        <div className="flex items-center ml-6">
          <FaUser className="text-white text-xl bg-blue-600 rounded p-1 mr-2 w-6 h-6" />
          <span className="font-bold text-lg">
            Recruiter <span className="text-blue-600"> AI </span>
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <div className="flex justify-center items-center mr-10 gap-10">
            <Link to="/"> Home </Link>
            <Link to="/jobs"> Jobs </Link>
            <Link to="/dashboard"> Dashboard </Link>
            <Link to="/applications"> Applications </Link>
          </div>

          <div className="ml-10 mr-6 flex items-center gap-4">
            {isAuth ? (
              <>
                <span className="text-gray-700 font-medium">
                  Welcome, <span className="text-blue-600 font-bold">{userEmail}</span>
                </span>
                <button
                  onClick={Handle_Logout}
                  className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="bg-blue-600 text-white px-4 py-2 rounded font-bold mr-4">
                  Login
                </NavLink>
                <NavLink to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded font-bold">
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>

        <button className="md:hidden text-2xl" onClick={() => setIsOpen(true)}> <FaBars /> </button>
      </nav>

      {
        isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
        )
      }

      <div className={`fixed top-0 left-0 h-full w-full bg-white shadow-lg z-50 transform transition-transform 
        duration-300 text-center space-y-6 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-bold text-lg">
            Recruiter <span className="text-blue-600"> AI </span>
          </span>
          <button onClick={() => setIsOpen(false)}> <FaTimes className="text-xl" /> </button>
        </div>

        <div className="flex flex-col p-4 space-y-4 text-sm font-medium">
          {isAuth && (
            <div className="bg-blue-50 p-3 rounded-lg mb-2">
              <p className="text-gray-700">
                Welcome, <span className="text-blue-600 font-bold"> {userEmail} </span>
              </p>
            </div>
          )}
          
          <Link to="/" onClick={() => setIsOpen(false)}> Home </Link>
          <Link to="/jobs" onClick={() => setIsOpen(false)}> Jobs </Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)}> Dashboard </Link>
          <Link to="/applications" onClick={() => setIsOpen(false)}> Applications </Link>

          {isAuth ? (
            <button onClick={Handle_Logout} className="bg-red-500 text-white px-4 py-2 rounded font-bold">
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded text-center font-bold"> Login 
              </NavLink>

              <NavLink to="/signup" onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded text-center font-bold"> Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;