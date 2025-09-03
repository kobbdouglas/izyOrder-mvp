import React from 'react';
import { Star, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface OffersSectionProps {
  restaurant: any;
}

const OffersSection: React.FC<OffersSectionProps> = ({ restaurant }) => {
  const { t, language } = useLanguage();

  const validOffers = restaurant.offers?.filter((offer: any) => offer.active) || [];

  if (validOffers.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
      <div className="flex items-center mb-3">
        <Star className="w-5 h-5 mr-2" />
        <h2 className="text-lg font-semibold">
          {t('specialOffers', { en: 'Special Offers', de: 'Spezielle Angebote' })}
        </h2>
      </div>
      <div className="space-y-3">
        {validOffers.map((offer: any) => (
          <div key={offer.id} className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold">
                {offer.title[language] || offer.title.en}
              </h3>
              <span className="text-sm font-bold">
                {offer.discount}% {t('off', { en: 'OFF', de: 'RABATT' })}
              </span>
            </div>
            <p className="text-sm opacity-90">
              {offer.description[language] || offer.description.en}
            </p>
            <div className="flex items-center mt-2 text-xs opacity-75">
              <Clock className="w-3 h-3 mr-1" />
              <span>
                {offer.validHours.start} - {offer.validHours.end}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersSection;