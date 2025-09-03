import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRestaurant } from '../../context/RestaurantContext';
import MenuItemModal from './MenuItemModal';
import DietaryIcons from '../shared/DietaryIcons';
import LanguageToggle from '../shared/LanguageToggle';
import OffersSection from './OffersSection';

const convertMenuItem = (dbItem: any) => ({
  id: dbItem.id,
  name: { en: dbItem.name_en, de: dbItem.name_de },
  description: { en: dbItem.description_en, de: dbItem.description_de },
  price: dbItem.price,
  image: dbItem.image_url || 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
  category: dbItem.category,
  dietaryInfo: {
    vegetarian: dbItem.is_vegetarian,
    vegan: dbItem.is_vegan,
    spiceLevel: dbItem.spice_level,
    meatType: dbItem.meat_type
  },
  soldOut: dbItem.is_sold_out
});

const CustomerMenu: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { restaurant, loading, error } = useRestaurant();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    if (restaurant?.menu_categories && restaurant.menu_categories.length > 0) {
      setActiveCategory(restaurant.menu_categories[0].id);
    }
  }, [restaurant]);

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

  // Convert restaurant data for legacy components
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
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/restaurant/${restaurant.slug}`)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              src={restaurant.logo_url || 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'}
              alt={restaurant.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="font-semibold text-gray-900">{restaurant.name}</h1>
            </div>
          </div>
          <LanguageToggle />
        </div>
      </div>

      {/* Offers Section */}
      <OffersSection restaurant={legacyRestaurant} />

      {/* Category Navigation */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 space-x-4">
          {restaurant.menu_categories.map((category: any) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'de' ? category.name_de : category.name_en}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 pb-20">
        {restaurant.menu_categories
          .filter((category: any) => category.id === activeCategory)
          .map((category: any) => (
            <div key={category.id}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'de' ? category.name_de : category.name_en}
              </h2>
              <div className="space-y-4">
                {category.menu_items.map((dbItem: any) => {
                  const item = convertMenuItem(dbItem);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer transform hover:scale-[1.02] ${
                        item.soldOut ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex">
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {item.name[language] || item.name.en}
                              {item.soldOut && (
                                <span className="ml-2 text-sm text-red-500 font-normal">
                                  ({t('soldOut', { en: 'Sold Out', de: 'Ausverkauft' })})
                                </span>
                              )}
                            </h3>
                            <span className="text-orange-600 font-bold text-lg">
                              €{item.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.description[language] || item.description.en}
                          </p>
                          <DietaryIcons item={item} />
                        </div>
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name[language] || item.name.en}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      {/* Item Modal */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default CustomerMenu;