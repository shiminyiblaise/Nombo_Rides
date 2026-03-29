import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2, Bike, User, ShieldCheck } from 'lucide-react';

const LOGO_URL = 'https://d64gsuwffb70l.cloudfront.net/69c87ac8cca9a14789abb64f_1774746342456_bafdf5b6.jpeg';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loginType, setLoginType] = useState<string>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, loginType);
      const state = location.state as any;
      if (loginType === 'admin') navigate('/admin');
      else if (loginType === 'rider') navigate('/rider');
      else navigate(state?.redirect || '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'user', label: 'Passenger', icon: User },
    { key: 'rider', label: 'Rider', icon: Bike },
    { key: 'admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={LOGO_URL} alt="Nombo" className="h-12 w-12 object-contain rounded" />
            <span className="text-2xl font-bold text-gray-900">NOMBO</span>
          </Link>
          <p className="mt-2 text-gray-500">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Login Type Tabs */}
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setLoginType(tab.key); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
                  loginType === tab.key
                    ? 'text-green-700 border-b-2 border-green-600 bg-green-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {loginType === 'admin' && (
              <p className="text-xs text-gray-400 text-center">
                Default: admin@nombo.com / admin123
              </p>
            )}
          </form>

          {loginType !== 'admin' && (
            <div className="px-6 pb-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link
                  to={`/register${loginType === 'rider' ? '?type=rider' : ''}`}
                  className="text-green-700 hover:text-green-800 font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
