import React from 'react';
import { Bell, User, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
   
    localStorage.removeItem('token');
    navigate('/login');
  
  };

  return (
    <header className="bg-white shadow">

        <div className="flex items-center justify-between h-16 ">
          {/* Logo and Brand Name */}
          <div className="flex bg-gray-900 items-center h-16 w-64 ">
            <div className="bg-gray-900 px-6 py-2 rounded-md">
              <h1 className="text-2xl font-bold text-white">Pet Admin</h1>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* User Section */}
          <div className="flex items-center space-x-6">
            <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors duration-150 focus:outline-none">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <img
                className="h-9 w-9 rounded-full border-2 border-gray-200"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User"
              />
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-150"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
  
      </div>
    </header>
  );
}

export default Navbar;

