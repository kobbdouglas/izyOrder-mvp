import React from 'react';
import OffersCarousel from '../shared/OffersCarousel';

interface OffersSectionProps {
  restaurant: any;
}

const OffersSection: React.FC<OffersSectionProps> = ({ restaurant }) => {
  const validOffers = restaurant.offers?.filter((offer: any) => offer.active) || [];

  if (validOffers.length === 0) return null;

  return (
    <OffersCarousel offers={validOffers} sticky={true} />
  );
};

export default OffersSection;