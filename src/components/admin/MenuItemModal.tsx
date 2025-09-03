import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MenuItemModalProps {
  item: any;
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
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {item.name[language] || item.name.en}
            </h2>
            <span className="text-2xl font-bold text-orange-600">
              €{item.price.toFixed(2)}
            </span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {item.description[language] || item.description.en}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
          >
            {t('close', { en: 'Close', de: 'Schließen' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;