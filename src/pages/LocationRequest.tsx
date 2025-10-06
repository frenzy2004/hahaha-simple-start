import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import WaveBackground from '../components/WaveBackground';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

interface LocationRequestProps {
  onSubmit: (location: string, businessType: string) => void;
}

const LocationRequest: React.FC<LocationRequestProps> = ({ onSubmit }) => {
  const [location, setLocation] = useState('');
  const [businessType, setBusinessType] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() && businessType) {
      onSubmit(location.trim(), businessType);
    }
  };

  const isFormValid = location.trim() && businessType;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <WaveBackground />
      
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-hover text-white p-8 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">BizLocation.ai</h1>
            <p className="text-blue-100 text-lg">
              Discover the perfect spot for your business with AI-powered insights
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Location Input */}
              <div>
                <label htmlFor="location" className="label label-required">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="e.g., near LRT KLCC, Malaysia"
                    className="input-with-icon text-base"
                    aria-label="Enter location for analysis"
                    required
                  />
                  
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-lg shadow-lg z-20 mt-1 max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.place_id}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-muted border-b border-border last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-foreground">
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
                <p className="input-hint">
                  Enter a specific address, landmark, or area you're considering
                </p>
              </div>

              {/* Business Type Dropdown */}
              <div>
                <label htmlFor="businessType" className="label label-required">
                  Business Type
                </label>
                <div className="relative">
                  <select
                    id="businessType"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="select text-base"
                    aria-label="Select business type"
                    required
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
                <p className="input-hint">
                  Choose the type of business you want to analyze
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full mt-8 py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isFormValid
                  ? 'btn-primary hover:scale-[1.02]'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              aria-label="Analyze selected location"
            >
              {isFormValid ? 'Analyze Location' : 'Please fill in all fields'}
            </button>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-primary-light rounded-lg border border-primary/20">
              <h3 className="font-semibold text-foreground mb-2">What you'll get:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Comprehensive demographic analysis</li>
                <li>• Competitor mapping and insights</li>
                <li>• Seasonal demand predictions</li>
                <li>• AI-powered success scoring</li>
                <li>• Interactive maps and visualizations</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationRequest;