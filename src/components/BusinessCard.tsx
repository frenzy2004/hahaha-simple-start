import React from 'react';
import { Star, MapPin, Phone } from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  onClick: (business: Business) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onClick }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-warning text-warning" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-border" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-warning text-warning" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-border" />
      );
    }

    return stars;
  };

  return (
    <div
      className="card hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
      onClick={() => onClick(business)}
    >
      <div className="flex p-4 gap-4">
        <img
          src={business.thumbnail}
          alt={business.name}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0 shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate text-base">{business.name}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-0.5">
              {renderStars(business.rating)}
            </div>
            <span className="text-sm font-medium text-foreground">{business.rating}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{business.address}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-primary">{business.distance}km away</span>
            <span className="badge-primary">
              {business.category}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-card-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-3.5 h-3.5" />
          <span>{business.contact}</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;