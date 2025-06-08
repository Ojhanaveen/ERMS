import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-400">
              RMS
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <FaUserCircle className="text-2xl text-indigo-400" />
                <span className="capitalize">{user.name}</span>
                <button
                  onClick={logout}
                  className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="text-gray-300 hover:text-indigo-400 focus:outline-none focus:text-indigo-400"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-1">
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 bg-indigo-600 rounded mt-2 hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2 px-3 py-2 border-t border-gray-700 mt-2">
                <FaUserCircle className="text-indigo-400 text-xl" />
                <span className="capitalize">{user.name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 bg-indigo-600 rounded mt-2 hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
