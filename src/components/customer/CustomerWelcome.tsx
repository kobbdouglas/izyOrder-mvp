import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRestaurant } from '../../context/RestaurantContext';
import LanguageToggle from '../shared/LanguageToggle';
import OffersSection from './OffersSection';

const CustomerWelcome: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { restaurant, loading, error } = useRestaurant();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Restaurant not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleViewMenu = () => {
    navigate(`/restaurant/${restaurant.slug}/menu`);
  };

  // Convert database offers to legacy format for OffersSection
  const legacyOffers = restaurant.offers?.map((offer: any) => ({
    id: offer.id,
    title: { en: offer.title_en, de: offer.title_de },
    description: { en: offer.description_en, de: offer.description_de },
    validDays: offer.valid_days,
    validHours: { start: offer.valid_hours_start, end: offer.valid_hours_end },
    active: offer.is_active,
    discount: offer.discount_percentage
  })) || [];

  const legacyRestaurant = {
    ...restaurant,
    offers: legacyOffers,
    customization: restaurant.restaurant_customization ? {
      welcomeText: {
        en: restaurant.restaurant_customization.welcome_text_en,
        de: restaurant.restaurant_customization.welcome_text_de
      },
      primaryColor: restaurant.restaurant_customization.primary_color,
      secondaryColor: restaurant.restaurant_customization.secondary_color,
      accentColor: restaurant.restaurant_customization.accent_color,
      fontStyle: restaurant.restaurant_customization.font_style
    } : null
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <img
              src={restaurant.logo_url || 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'}
              alt={restaurant.name}
              className="w-10 h-10 rounded-full"
            />
            <h1 className="text-xl font-semibold text-gray-900">{restaurant.name}</h1>
          </div>
          <LanguageToggle variant="light" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <img
          src={restaurant.hero_image_url || 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg'}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
            <p className="text-lg mb-6 max-w-md">
              {language === 'de' ? restaurant.description_de : restaurant.description_en}
            </p>
            {legacyRestaurant.customization?.welcomeText && (
              <p className="text-base opacity-90 mb-8 max-w-lg">
                {legacyRestaurant.customization.welcomeText[language] || legacyRestaurant.customization.welcomeText.en}
              </p>
            )}
            <button
              onClick={handleViewMenu}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center space-x-2 mx-auto"
            >
              <span>{t('viewMenu', { en: 'View Menu', de: 'Speisekarte ansehen' })}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <OffersSection restaurant={legacyRestaurant} />

      {/* Quick Info */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('aboutRestaurant', { en: 'About the Restaurant', de: 'Über das Restaurant' })}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {language === 'de' ? restaurant.description_de : restaurant.description_en}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerWelcome;