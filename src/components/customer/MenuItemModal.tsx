import React from 'react';
import { X } from 'lucide-react';
import { MenuItem } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import DietaryIcons from '../shared/DietaryIcons';

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose }) => {
  const { t, language } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center p-4">
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <img
            src={item.image}
            alt={item.name[language] || item.name.en}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          {item.soldOut && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                {t('soldOut', { en: 'Sold Out', de: 'Ausverkauft' })}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              {item.name[language] || item.name.en}
            </h2>
            <span className="text-3xl font-bold text-orange-600 ml-4">
              €{item.price.toFixed(2)}
            </span>
          </div>

          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            {item.description[language] || item.description.en}
          </p>

          {/* Dietary Information */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-800 mb-4">
              {t('dietaryInfo', { en: 'Dietary Information', de: 'Ernährungshinweise' })}
            </h3>
            <DietaryIcons item={item} showLabels />
          </div>

          {/* Spice Level */}
          {item.dietaryInfo.spiceLevel > 0 && (
            <div className="mb-8">
              <h3 className="text-base font-bold text-gray-800 mb-3">
                {t('spiceLevel', { en: 'Spice Level', de: 'Schärfegrad' })}
              </h3>
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`w-6 h-6 rounded-full ${
                      level <= item.dietaryInfo.spiceLevel
                        ? 'bg-red-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({item.dietaryInfo.spiceLevel}/3)
                </span>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors duration-200 shadow-lg"
          >
            {t('close', { en: 'Close', de: 'Schließen' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;