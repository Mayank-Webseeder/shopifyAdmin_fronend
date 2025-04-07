import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Layers, BookOpen, ShoppingBag, Home, LogOut, BadgePercent } from 'lucide-react';
import logo from '../../public/logo1.png';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="lg:flex">
      <div className="flex flex-col w-64 border-r border-gray-800 shadow-xl">
        <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="flex items-center h-28 px-6 border-b border-gray-700 bg-gray-850">
            <img src={logo} className='h-full w-full object-contain object-center' />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="flex flex-col space-y-2">
              {[
                { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { to: '/home', icon: Home, label: 'Home Page' },
                { to: '/offers', icon: BadgePercent, label: 'Offers' },
                { to: '/manage-pages', icon: BookOpen, label: 'Manage Pages' },
                { to: '/categories', icon: Layers, label: 'Manage Categories' },
                { to: '/products', icon: ShoppingBag, label: 'Products' },
              ].map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${isActive
                      ? 'bg-[#483285] text-white ring-1 ring-purple-500/30'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5 opacity-75" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Admin Info & Logout Button */}
          <div className="px-4 py-4 border-t border-gray-700 bg-gray-850">
            <div className="flex items-center justify-between">
              {/* Admin Details */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center ring-2 ring-blue-500/30">
                  <span className="text-sm font-semibold text-white">GVP</span>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-white">Admin User</div>
                  <div className="text-xs text-gray-400">Administrator</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-red-400 hover:text-red-500 transition-all duration-200"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
