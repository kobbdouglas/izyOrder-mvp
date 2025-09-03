import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, loading } = useAuth();
  const [email, setEmail] = useState('memetyerlikaya@gmail.com');
  const [password, setPassword] = useState('izyordertest');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn(email, password);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 text-center relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ChefHat className="w-12 h-12 mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Restaurant Admin</h1>
          <p className="text-gray-300 text-sm">Sign in to manage your restaurant</p>
        </div>

        {/* Login Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/admin/signup" className="text-orange-500 hover:text-orange-600 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;