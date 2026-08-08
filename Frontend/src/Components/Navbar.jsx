import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const Handle_Logout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-2 flex justify-between items-center z-50">
        <div className="flex items-center ml-6">
          <FaUser className="text-white text-xl bg-blue-600 rounded p-1 mr-2 w-6 h-6" />
          <span className="font-bold text-lg">
            Recruiter <span className="text-blue-600">AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <div className="flex justify-center items-center mr-10 gap-10">
            <Link to="/">Home</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/applications">Applications</Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 font-medium whitespace-nowrap">
                  Welcome,&nbsp;
                  <span className="text-blue-600 font-bold">
                    {user?.name || user?.email}
                  </span>
                </span>
                <button
                  onClick={Handle_Logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
                >
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(true)}
        >
          <FaBars />
        </button>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-bold text-lg">
            Recruiter <span className="text-blue-600">AI</span>
          </span>
          <button onClick={() => setIsOpen(false)}>
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-4 text-center">
          {isAuthenticated && (
            <div className="bg-blue-50 rounded-lg p-3">
              <span className="font-medium">
                Welcome,&nbsp;
                <span className="text-blue-600 font-bold">
                  {user?.name || user?.email}
                </span>
              </span>
            </div>
          )}

          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/jobs" onClick={() => setIsOpen(false)}>Jobs</Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/applications" onClick={() => setIsOpen(false)}>Applications</Link>

          {isAuthenticated ? (
            <button
              onClick={Handle_Logout}
              className="bg-red-500 text-white px-4 py-2 rounded font-bold"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded text-center font-bold"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded text-center font-bold"
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
