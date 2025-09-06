import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Offer {
  id: string;
  title: { en: string; de: string };
  description: { en: string; de: string };
  validDays: number[];
  validHours: { start: string; end: string };
  active: boolean;
  discount: number;
}

interface OffersCarouselProps {
  offers: Offer[];
  autoScroll?: boolean;
  autoScrollInterval?: number;
}

const OffersCarousel: React.FC<OffersCarouselProps> = ({ 
  offers, 
  autoScroll = true, 
  autoScrollInterval = 4000 
}) => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const validOffers = offers.filter(offer => offer.active);

  useEffect(() => {
    if (!autoScroll || validOffers.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === validOffers.length - 1 ? 0 : prevIndex + 1
      );
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval, validOffers.length, isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? validOffers.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === validOffers.length - 1 ? 0 : currentIndex + 1);
  };

  if (validOffers.length === 0) return null;

  // Placeholder images for offers
  const getOfferImage = (index: number) => {
    const images = [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
      'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg'
    ];
    return images[index % images.length];
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Star className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">
              {t('specialOffers', { en: 'Special Offers', de: 'Spezielle Angebote' })}
            </h2>
          </div>
          
          {validOffers.length > 1 && (
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={goToPrevious}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {validOffers.map((offer, index) => (
              <div key={offer.id} className="w-full flex-shrink-0">
                <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8 px-4">
                  {/* Circular Image */}
                  <div className="relative">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl border-4 border-white border-opacity-30">
                      <img
                        src={getOfferImage(index)}
                        alt={offer.title[language] || offer.title.en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Special Offer Badge */}
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold">{offer.discount}%</div>
                        <div className="text-xs font-medium">OFF</div>
                      </div>
                    </div>
                  </div>

                  {/* Offer Details */}
                  <div className="text-center md:text-left max-w-md">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">
                      {offer.title[language] || offer.title.en}
                    </h3>
                    <p className="text-lg opacity-90 mb-4 leading-relaxed">
                      {offer.description[language] || offer.description.en}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
                      <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
                        <span className="font-medium">
                          {offer.validHours.start} - {offer.validHours.end}
                        </span>
                      </div>
                      <div className="bg-yellow-400 text-gray-900 rounded-full px-4 py-1 font-bold">
                        {offer.discount}% {t('discount', { en: 'DISCOUNT', de: 'RABATT' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        {validOffers.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {validOffers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        )}

        {/* Mobile Navigation */}
        {validOffers.length > 1 && (
          <div className="flex md:hidden justify-center mt-6 space-x-4">
            <button
              onClick={goToPrevious}
              className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersCarousel;