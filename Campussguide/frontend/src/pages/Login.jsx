import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email: formData.email, password: formData.password });
        login(data);
        navigate('/');
      } else {
        const { data } = await api.post('/auth/register', formData);
        login(data);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 glass-card p-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-slate-400">{isLogin ? 'Sign in to review and discover' : 'Join the campus community'}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required={!isLogin}
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
          <input
            type="email"
            className="input-field"
            placeholder="student@campus.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
           <input
             type="password"
             className="input-field"
             placeholder="••••••••"
             value={formData.password}
             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
             required
           />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">I am a...</label>
            <select
              className="input-field appearance-none"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="student">Student / User</option>
              <option value="owner">Business Owner</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn-primary w-full mt-6 py-3 flex items-center justify-center gap-2">
          {isLogin ? <><LogIn className="w-5 h-5" /> Sign In</> : <><UserPlus className="w-5 h-5"/> Register</>}
        </button>
      </form>

      <div className="mt-6 text-center text-slate-400">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-brand-400 font-semibold hover:text-brand-300 transition-colors"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </div>
    </div>
  );
};

export default Login;
