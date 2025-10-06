import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import NeuralNetworkHero from '../components/ui/neural-network-hero';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

interface LocationRequestProps {
  onSubmit: (location: string, businessType: string) => void;
}

const LocationRequest: React.FC<LocationRequestProps> = ({ onSubmit }) => {
  const [location, setLocation] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessScale, setBusinessScale] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteService = useRef<any | null>(null);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    
    if (value.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ['establishment', 'geocode']
        },
        (predictions: any, status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.slice(0, 5));
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setLocation(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const businessTypes = [
    'Restaurant',
    'Cafe',
    'Retail Store',
    'Office Space',
    'Gym/Fitness',
    'Beauty Salon',
    'Medical Clinic',
    'Educational Center',
    'Entertainment Venue',
    'Service Business',
  ];

  const businessScales = [
    'SME',
    'Franchise',
    'Corporate'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() && businessType) {
      onSubmit(location.trim(), businessType);
    }
  };

  const isFormValid = location.trim() && businessType && businessScale;

  return (
    <NeuralNetworkHero
      title="Finding the best location for your business"
      description="Analyze potential locations with AI-powered insights. Get detailed reports on demographics, competition, and success predictions."
      badgeText="AI Location Analysis"
      badgeLabel="Beta"
    >
        {/* Brand Header - Minimalist */}
        <div className="flex items-center justify-start gap-3 mb-8">
          <MapPin className="w-8 h-8 text-white/90" />
          <h2 className="text-2xl font-extralight tracking-tight text-white">
            BizLocate
          </h2>
        </div>

        {/* Horizontal Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-6xl">
          <div className="flex items-start gap-3 w-full">
            {/* Location Input with Suggestions */}
            <div className="flex-1 relative">
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="e.g., near LRT KLCC, Malaysia"
                className="w-full h-12 px-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all text-sm"
                required
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2.5 hover:bg-foreground/5 transition-colors border-b border-foreground/10 last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-white/60 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-foreground text-sm">
                            {suggestion.structured_formatting.main_text}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {suggestion.structured_formatting.secondary_text}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Business Type Dropdown */}
            <div className="relative">
              <select
                id="business-type"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="h-12 px-5 pr-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all min-w-[200px] appearance-none text-sm"
                required
              >
                <option value="">Select business type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
            </div>

            {/* Business Scale Dropdown */}
            <div className="relative">
              <select
                id="business-scale"
                value={businessScale}
                onChange={(e) => setBusinessScale(e.target.value)}
                className="h-12 px-5 pr-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all min-w-[200px] appearance-none text-sm"
                required
              >
                <option value="">Select business scale</option>
                {businessScales.map((scale) => (
                  <option key={scale} value={scale}>
                    {scale}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className="h-12 px-6 bg-white/20 hover:bg-white/30 text-white font-light rounded-xl transition-all border border-white/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/20 whitespace-nowrap text-sm backdrop-blur-md"
            >
              {isFormValid ? 'Analyze' : 'Fill all fields'}
            </button>
          </div>
        </form>
    </NeuralNetworkHero>
  );
};

export default LocationRequest;