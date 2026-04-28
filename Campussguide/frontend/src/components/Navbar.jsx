import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MapPin, LogOut, User, Store } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-card sticky top-0 z-50 rounded-none border-t-0 border-x-0 border-white/10 px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-brand-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <MapPin className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-blue-200">
            CampusGuide
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/businesses" className="text-slate-300 hover:text-white transition-colors font-medium">Explore Spots</Link>
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'owner' && (
                <Link to="/create-business" className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors font-medium mr-2">
                  <Store className="h-4 w-4" /> Add Spot
                </Link>
              )}
              <span className="flex items-center gap-2 text-brand-300 flex-shrink-0 bg-brand-500/10 px-3 py-1.5 rounded-full text-sm font-medium">
                <User className="h-4 w-4" /> {user.name}
              </span>
              <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 flex-shrink-0 hover:text-red-400 transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-5 p-0">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
