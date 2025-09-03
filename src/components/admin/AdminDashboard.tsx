import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Settings, 
  Star, 
  LogOut, 
  BarChart3, 
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserRestaurant } from '../../services/restaurantService';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!user) {
        navigate('/admin');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const result = await getUserRestaurant();
        
        if (!result.success) {
          setError(result.error || 'Failed to load restaurant');
          return;
        }
        
        if (!result.data) {
          setError('No restaurant found for this user');
          return;
        }
        
        setRestaurant(result.data);
      } catch (err) {
        console.error('Error loading restaurant:', err);
        setError('Failed to load restaurant data');
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No restaurant found</p>
          <button
            onClick={() => navigate('/admin')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const totalMenuItems = restaurant.menu_categories?.reduce((total: number, category: any) => 
    total + (category.menu_items?.length || 0), 0) || 0;
  
  const activeOffers = restaurant.offers?.filter((offer: any) => offer.is_active)?.length || 0;
  
  const soldOutItems = restaurant.menu_categories?.reduce((total: number, category: any) => 
    total + (category.menu_items?.filter((item: any) => item.is_sold_out)?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <img
              src={restaurant.logo_url || 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'}
              alt={restaurant.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{restaurant.name}</h1>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Menu className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Menu Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalMenuItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Offers</p>
              <p className="text-2xl font-bold text-gray-900">{activeOffers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sold Out</p>
              <p className="text-2xl font-bold text-gray-900">{soldOutItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{restaurant.menu_categories?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/menu')}
            className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                <Menu className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Menu</h3>
            </div>
            <p className="text-gray-600">
              Update menu items, prices, and availability status
            </p>
          </button>

          <button
            onClick={() => navigate('/admin/offers')}
            className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Offers</h3>
            </div>
            <p className="text-gray-600">
              Create and manage promotional offers and discounts
            </p>
          </button>

          <button
            onClick={() => navigate('/admin/settings')}
            className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Restaurant Settings</h3>
            </div>
            <p className="text-gray-600">
              Customize appearance, colors, and welcome messages
            </p>
          </button>
        </div>
      </div>

      {/* Restaurant Preview */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Restaurant Preview</h2>
            <button
              onClick={() => navigate(`/restaurant/${restaurant.slug}`)}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              View Live Menu →
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <img
              src={restaurant.logo_url || 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'}
              alt={restaurant.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
              <p className="text-gray-600 text-sm">{restaurant.description_en}</p>
              <p className="text-orange-500 text-sm font-medium mt-1">
                /{restaurant.slug}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;