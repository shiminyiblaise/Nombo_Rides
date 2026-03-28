import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';

const LOGO_URL = 'https://d64gsuwffb70l.cloudfront.net/69c87ac8cca9a14789abb64f_1774746342456_bafdf5b6.jpeg';

const Navbar: React.FC = () => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (userType === 'rider') return '/rider';
    if (userType === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Nombo" className="h-10 w-10 object-contain rounded" />
            <span className="text-xl font-bold text-gray-900">NOMBO</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-green-700 font-medium transition-colors">Ride</Link>
            <a href="#how-it-works" className="text-gray-600 hover:text-green-700 font-medium transition-colors">How It Works</a>
            <a href="#safety" className="text-gray-600 hover:text-green-700 font-medium transition-colors">Safety</a>
            <Link to="/register?type=rider" className="text-gray-600 hover:text-green-700 font-medium transition-colors">Become a Rider</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                    <button
                      onClick={() => { navigate(getDashboardPath()); setDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => { handleLogout(); setDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-700 font-medium px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-5 py-2 rounded-full transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-2">Ride</Link>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-2">How It Works</a>
          <a href="#safety" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-2">Safety</a>
          <Link to="/register?type=rider" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-2">Become a Rider</Link>
          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <>
                <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-2">Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block text-red-600 font-medium py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-2">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block bg-yellow-500 text-gray-900 font-semibold text-center py-2 rounded-full mt-2">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
