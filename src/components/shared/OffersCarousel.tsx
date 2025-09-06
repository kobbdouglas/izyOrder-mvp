import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
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
  sticky?: boolean;
}

const OffersCarousel: React.FC<OffersCarouselProps> = ({ 
  offers, 
  autoScroll = true, 
  autoScrollInterval = 4000,
  sticky = false
}) => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const validOffers = offers.filter(offer => offer.active);

  // Auto-minimize on scroll (for sticky mode)
  useEffect(() => {
    if (!sticky) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsMinimized(scrollY > 120);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);

  useEffect(() => {
    if (!autoScroll || validOffers.length <= 1 || isHovered || isCollapsed) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === validOffers.length - 1 ? 0 : prevIndex + 1
      );
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval, validOffers.length, isHovered, isCollapsed]);

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

  // Sticky minimized view
  if (sticky && isMinimized && !isCollapsed) {
    const currentOffer = validOffers[currentIndex];
    return (
      <div className="fixed top-16 left-0 right-0 z-30 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg border-b border-orange-600">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Star className="w-4 h-4 flex-shrink-0" />
            <div className="text-sm min-w-0 flex-1">
              <span className="font-semibold truncate block">
                {currentOffer.title[language] || currentOffer.title.en}
              </span>
              <span className="inline-block bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold mt-1">
                {currentOffer.discount}% OFF
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {validOffers.length > 1 && (
              <div className="flex space-x-1">
                <button
                  onClick={goToPrevious}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={goToNext}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
    <div className={`bg-gradient-to-r from-orange-400 to-red-400 text-white transition-all duration-300 ${
      sticky ? 'sticky top-16 z-20' : ''
    } ${isCollapsed ? 'py-2' : 'py-4 md:py-6'} ${sticky && isMinimized ? 'transform -translate-y-full' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center">
            <Star className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
            <h2 className="text-xl md:text-2xl font-bold">
              {t('specialOffers', { en: 'Special Offers', de: 'Spezielle Angebote' })}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Collapse/Expand Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 md:p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
              aria-label={isCollapsed ? 'Expand offers' : 'Collapse offers'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            
            {/* Navigation arrows - only show when expanded and multiple offers */}
            {!isCollapsed && validOffers.length > 1 && (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={goToPrevious}
                  className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
                  aria-label="Previous offer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="p-2 rounded-full bg-white bg-opacity-30 hover:bg-opacity-30 transition-all duration-200"
                  aria-label="Next offer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* Minimize button for sticky mode */}
            {sticky && !isCollapsed && (
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 md:p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
                aria-label="Minimize offers"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expanded State - Full Carousel */}
        {!isCollapsed && (
          <div className="overflow-hidden">
            <div 
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out will-change-transform"
                style={{ 
                  transform: `translateX(-${currentIndex * 100}%)`,
                  backfaceVisibility: 'hidden'
                }}
              >
                {validOffers.map((offer, index) => (
                  <div key={offer.id} className="w-full flex-shrink-0">
                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 lg:space-x-8 px-2 md:px-4 py-2">
                      {/* Circular Image - Responsive sizing */}
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-xl border-2 md:border-4 border-white border-opacity-30">
                          <img
                            src={getOfferImage(index)}
                            alt={offer.title[language] || offer.title.en}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        
                        {/* Special Offer Badge - Responsive sizing */}
                        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-yellow-400 text-gray-900 rounded-full w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 flex items-center justify-center shadow-lg border-2 border-white">
                          <div className="text-center">
                            <div className="text-xs md:text-sm font-bold leading-none">{offer.discount}%</div>
                            <div className="text-xs font-medium hidden lg:block leading-none">OFF</div>
                          </div>
                        </div>
                      </div>

                      {/* Offer Details */}
                      <div className="text-center md:text-left max-w-md lg:max-w-lg flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 leading-tight">
                          {offer.title[language] || offer.title.en}
                        </h3>
                        <p className="text-sm md:text-base opacity-90 mb-3 md:mb-4 leading-relaxed line-clamp-2">
                          {offer.description[language] || offer.description.en}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-3 text-xs md:text-sm">
                          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1 backdrop-blur-sm">
                            <span className="font-medium whitespace-nowrap">
                              {offer.validHours.start} - {offer.validHours.end}
                            </span>
                          </div>
                          <div className="bg-yellow-400 text-gray-900 rounded-full px-3 md:px-4 py-1 font-bold shadow-md">
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
              <div className="flex justify-center space-x-2 mt-4 pb-1">
                {validOffers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                      index === currentIndex 
                        ? 'bg-white scale-110' 
                        : 'bg-white bg-opacity-50 hover:bg-opacity-75 hover:scale-105'
                    }`}
                    aria-label={`Go to offer ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersCarousel;