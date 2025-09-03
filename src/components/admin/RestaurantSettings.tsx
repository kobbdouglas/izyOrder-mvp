import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';

const RestaurantSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { restaurant, updateCustomization } = useRestaurant();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    welcomeTextEn: '',
    welcomeTextDe: '',
    primaryColor: '#f97316',
    secondaryColor: '#059669',
    accentColor: '#dc2626',
    fontStyle: 'modern'
  });

  useEffect(() => {
    if (!user) {
      navigate('/admin');
      return;
    }

    if (restaurant?.restaurant_customization) {
      const customization = restaurant.restaurant_customization;
      setFormData({
        welcomeTextEn: customization.welcome_text_en || '',
        welcomeTextDe: customization.welcome_text_de || '',
        primaryColor: customization.primary_color || '#f97316',
        secondaryColor: customization.secondary_color || '#059669',
        accentColor: customization.accent_color || '#dc2626',
        fontStyle: customization.font_style || 'modern'
      });
    }
  }, [user, restaurant, navigate]);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    const success = await updateCustomization({
      welcome_text_en: formData.welcomeTextEn,
      welcome_text_de: formData.welcomeTextDe,
      primary_color: formData.primaryColor,
      secondary_color: formData.secondaryColor,
      accent_color: formData.accentColor,
      font_style: formData.fontStyle
    });

    if (success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Restaurant Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mx-4 mt-4 rounded-lg">
          Settings saved successfully!
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Welcome Text */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome Text</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                English Welcome Text
              </label>
              <textarea
                value={formData.welcomeTextEn}
                onChange={(e) => setFormData({ ...formData, welcomeTextEn: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Welcome to our restaurant..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                German Welcome Text
              </label>
              <textarea
                value={formData.welcomeTextDe}
                onChange={(e) => setFormData({ ...formData, welcomeTextDe: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Willkommen in unserem Restaurant..."
              />
            </div>
          </div>
        </div>

        {/* Color Customization */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Color Theme</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Font Style */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Font Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['modern', 'classic', 'elegant'].map((style) => (
              <button
                key={style}
                onClick={() => setFormData({ ...formData, fontStyle: style })}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.fontStyle === style
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900 capitalize mb-1">{style}</h3>
                <p className="text-sm text-gray-600">
                  {style === 'modern' && 'Clean, contemporary typography'}
                  {style === 'classic' && 'Traditional, timeless fonts'}
                  {style === 'elegant' && 'Sophisticated, refined styling'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="border border-gray-200 rounded-lg p-4" style={{ backgroundColor: `${formData.primaryColor}10` }}>
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: formData.primaryColor }}
              />
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: formData.secondaryColor }}
              />
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: formData.accentColor }}
              />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: formData.fontStyle === 'classic' ? 'serif' : 'sans-serif' }}>
              {restaurant.name}
            </h3>
            <p className="text-gray-600 text-sm">
              {formData.welcomeTextEn || 'Your welcome text will appear here...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSettings;