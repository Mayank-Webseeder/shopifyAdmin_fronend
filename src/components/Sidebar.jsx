import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Layers, BookOpen, ShoppingBag, Settings } from 'lucide-react';

function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-800">
        <div className="flex flex-col h-screen bg-gray-900">
          {/* <div className="flex items-center h-16 px-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-white">Pet Admin</h1>
          </div>
           */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="flex flex-col space-y-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </NavLink>
              
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Layers className="mr-3 h-5 w-5" />
                Categories
              </NavLink>
              
              <NavLink
                to="/breed-pages"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <BookOpen className="mr-3 h-5 w-5" />
                Breed Pages
              </NavLink>
              
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Products
              </NavLink>
              
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </NavLink>
            </nav>
          </div>
          
          <div className="px-4 py-4 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium text-white">PA</span>
              </div>
              <div className="text-sm text-gray-300">Admin User</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;