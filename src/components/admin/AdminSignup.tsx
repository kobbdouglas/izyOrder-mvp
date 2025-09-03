import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, ArrowLeft, User, Building, Globe } from 'lucide-react';
import { signUp } from '../../services/authService';
import { createRestaurant } from '../../services/restaurantService';

const AdminSignup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // User data
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Restaurant data
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    description_en: '',
    description_de: '',
    logo_url: '',
    hero_image_url: ''
  });

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setStep(2);
  };

  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Create user account
      const authResult = await signUp(userData.email, userData.password);
      
      if (!authResult.user) {
        setError(authResult.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      // Step 2: Create restaurant
      const slug = restaurantData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const restaurantResult = await createRestaurant({
        ...restaurantData,
        slug
      });
      
      if (!restaurantResult.success) {
        setError(restaurantResult.error || 'Failed to create restaurant');
        setLoading(false);
        return;
      }

      // Success! Redirect to dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 text-center relative">
          <button
            onClick={() => step === 1 ? navigate('/') : setStep(1)}
            className="absolute top-4 left-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ChefHat className="w-12 h-12 mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Create Your Restaurant</h1>
          <p className="text-gray-300 text-sm">
            {step === 1 ? 'Step 1: Account Setup' : 'Step 2: Restaurant Details'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-1">
          <div 
            className="bg-orange-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        {/* Step 1: User Account */}
        {step === 1 && (
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={userData.confirmPassword}
                  onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Repeat your password"
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
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Continue to Restaurant Setup
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/admin" className="text-orange-500 hover:text-orange-600 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Restaurant Details */}
        {step === 2 && (
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Building className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Restaurant Details</h2>
            </div>

            <form onSubmit={handleRestaurantSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={restaurantData.name}
                  onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Bella Vista"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (English)
                </label>
                <textarea
                  value={restaurantData.description_en}
                  onChange={(e) => setRestaurantData({ ...restaurantData, description_en: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe your restaurant in English..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (German)
                </label>
                <textarea
                  value={restaurantData.description_de}
                  onChange={(e) => setRestaurantData({ ...restaurantData, description_de: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Beschreiben Sie Ihr Restaurant auf Deutsch..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL (Optional)
                </label>
                <input
                  type="url"
                  value={restaurantData.logo_url}
                  onChange={(e) => setRestaurantData({ ...restaurantData, logo_url: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com/logo.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={restaurantData.hero_image_url}
                  onChange={(e) => setRestaurantData({ ...restaurantData, hero_image_url: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com/hero.jpg"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Restaurant...' : 'Create Restaurant'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSignup;