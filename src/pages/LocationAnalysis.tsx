import React, { useState, useEffect } from 'react';
import { Menu, X, Download, ArrowLeft, Map } from 'lucide-react';
import GoogleMap from '../components/GoogleMap';
import TabNavigation from '../components/TabNavigation';
import SeasonalDemandChart from '../components/charts/SeasonalDemandChart';
import DemographicChart from '../components/charts/DemographicChart';
import CompetitorChart from '../components/charts/CompetitorChart';
import LocationProfileChart from '../components/charts/LocationProfileChart';
import CompetitionDensityChart from '../components/charts/CompetitionDensityChart';
import SuccessScoreChart from '../components/charts/SuccessScoreChart';
import BusinessCard from '../components/BusinessCard';
import BusinessDetail from '../components/BusinessDetail';
import AIAssistant from '../components/AIAssistant';
import KPICards from '../components/KPICards';
import RentLocationContent from '../components/RentLocationContent';
import { LocationAnalysis as LocationAnalysisType, Business, AnalysisTab, Location } from '../types';
import { mockAnalysis } from '../data/mockData';
import { geocodeLocation } from '../utils/geocoding';
import { findNearbyBusinesses } from '../utils/placesService';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { generateEnhancedPDF } from '../utils/pdfExport';

interface LocationAnalysisProps {
  location: string;
  businessType: string;
  onBack: () => void;
  tabs: AnalysisTab[];
  activeTabId: string | null;
  onTabSwitch: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewComparison: () => void;
}

const LocationAnalysis: React.FC<LocationAnalysisProps> = ({ 
  location, 
  businessType, 
  onBack,
  tabs,
  activeTabId,
  onTabSwitch,
  onTabClose,
  onNewComparison,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'businesses' | 'rent' | 'ai-insight' | 'urban-development'>('overview');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [actualLocation, setActualLocation] = useState<Location | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showMap, setShowMap] = useState(false);
  const { isLoaded } = useGoogleMaps();

  // Geocode the location when component mounts or location changes
  useEffect(() => {
    const getLocationCoordinates = async () => {
      if (!isLoaded) return;
      
      setIsGeocoding(true);
      const geocodedLocation = await geocodeLocation(location);
      
      let finalLocation: Location;
      if (geocodedLocation) {
        finalLocation = geocodedLocation;
      } else {
        // Fallback to mock location if geocoding fails
        finalLocation = { ...mockAnalysis.location, address: location };
      }
      
      setActualLocation(finalLocation);
      
      // Find real businesses using Places API
      const realBusinesses = await findNearbyBusinesses(finalLocation, businessType);
      setBusinesses(realBusinesses);
      
      setIsGeocoding(false);
    };

    getLocationCoordinates();
  }, [location, businessType, isLoaded]);

  const analysis: LocationAnalysisType = {
    ...mockAnalysis,
    location: actualLocation || { ...mockAnalysis.location, address: location },
    businessType,
  };

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleRecenterMap = (_business: Business) => {
    setSelectedBusiness(null);
    // Map will automatically update with the business location
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generateEnhancedPDF({
        location,
        businessType,
        analysis,
        businesses,
        mapElementId: 'google-map-container',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-screen bg-muted flex flex-col">
      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSwitch={onTabSwitch}
        onTabClose={onTabClose}
        onNewComparison={onNewComparison}
      />

      {/* Header */}
      <div className="bg-background shadow-sm border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="btn-icon btn-ghost"
            aria-label="Go back to location request"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="btn-icon btn-ghost lg:hidden"
            aria-label={isPanelOpen ? 'Close analysis panel' : 'Open analysis panel'}
          >
            {isPanelOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-foreground">Location Analysis</h1>
            <p className="text-sm text-muted-foreground">{location} • {businessType}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadPDF}
            disabled={isDownloading}
            className="btn-success"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{isDownloading ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - AI Assistant (Always Visible on Desktop) */}
        <div className="hidden lg:block lg:w-[30%] bg-card border-r border-border overflow-hidden">
          <div className="h-full">
            <AIAssistant />
          </div>
        </div>

        {/* Right Panel with Sub-tabs and Content */}
        <div className="flex-1 transition-all duration-300 ease-in-out flex flex-col">
          {/* Map View + Tabs Combined Row */}
          <div className="bg-background border-b border-border px-6 py-3">
            <div className="flex gap-3 overflow-x-auto">
              <button
                onClick={() => setShowMap(!showMap)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  showMap
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Map className="w-4 h-4" />
                Map View
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('businesses')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'businesses'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Competitor nearby
              </button>
              <button
                onClick={() => setActiveTab('rent')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'rent'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Rent location
              </button>
              <button
                onClick={() => setActiveTab('urban-development')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'urban-development'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Urban Development
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'overview' ? (
              isGeocoding ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <div className="text-muted-foreground">Finding location...</div>
                  </div>
                </div>
              ) : showMap ? (
                <div id="google-map-container" className="h-full">
                  <GoogleMap
                    location={actualLocation!}
                    businesses={businesses}
                    onBusinessClick={handleBusinessClick}
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <div className="p-6 space-y-8">
                  <div id="success-score-chart">
                    <SuccessScoreChart score={analysis.successScore} />
                  </div>
                  <KPICards kpis={analysis.kpis} />
                  <div id="seasonal-demand-chart">
                    <SeasonalDemandChart data={analysis.seasonalDemand} />
                  </div>
                  <div id="demographic-chart">
                    <DemographicChart data={analysis.demographics} />
                  </div>
                  <div id="competitor-chart">
                    <CompetitorChart data={analysis.competitors} />
                  </div>
                  <div id="location-profile-chart">
                    <LocationProfileChart data={analysis.locationProfile} />
                  </div>
                  <div id="competition-density-chart">
                    <CompetitionDensityChart data={analysis.competitionDensity} />
                  </div>
                </div>
              )
            ) : activeTab === 'businesses' ? (
              <div className="p-6 space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  {businesses.length} businesses found within 1km radius
                </div>
                {businesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    onClick={handleBusinessClick}
                  />
                ))}
              </div>
            ) : activeTab === 'rent' ? (
              <div className="p-6">
                <RentLocationContent location={location} businessType={businessType} />
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Urban Development Analysis</h3>
                    <p className="text-muted-foreground">Infrastructure and development insights for this location.</p>
                  </div>
                  <div className="grid gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Public Transportation</h4>
                      <p className="text-sm text-muted-foreground">Analysis of nearby transit options and accessibility.</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Future Developments</h4>
                      <p className="text-sm text-muted-foreground">Planned infrastructure and construction projects in the area.</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Amenities</h4>
                      <p className="text-sm text-muted-foreground">Nearby facilities, parks, schools, and shopping centers.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Analysis Panel Overlay */}
        {isPanelOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-background">
            <div className="h-full flex flex-col">
              {/* Panel Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsPanelOpen(false)}
                    className="btn-icon btn-ghost"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex-1 text-center">
                    <h2 className="text-lg font-semibold text-foreground">Analysis Dashboard</h2>
                    <p className="text-sm text-muted-foreground">{businessType} in {location}</p>
                  </div>
                </div>
              </div>

              {/* Mobile Tabs */}
              <div className="bg-background border-b border-border px-4 py-2">
                <div className="flex gap-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'overview'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('businesses')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'businesses'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    Businesses
                  </button>
                  <button
                    onClick={() => setActiveTab('rent')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'rent'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    Rent
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-insight')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'ai-insight'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    AI Chat
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'overview' ? (
                  <div className="p-6 space-y-8">
                    <div id="success-score-chart-mobile">
                      <SuccessScoreChart score={analysis.successScore} />
                    </div>
                    <KPICards kpis={analysis.kpis} />
                    <div id="seasonal-demand-chart-mobile">
                      <SeasonalDemandChart data={analysis.seasonalDemand} />
                    </div>
                    <div id="demographic-chart-mobile">
                      <DemographicChart data={analysis.demographics} />
                    </div>
                    <div id="competitor-chart-mobile">
                      <CompetitorChart data={analysis.competitors} />
                    </div>
                    <div id="location-profile-chart-mobile">
                      <LocationProfileChart data={analysis.locationProfile} />
                    </div>
                    <div id="competition-density-chart-mobile">
                      <CompetitionDensityChart data={analysis.competitionDensity} />
                    </div>
                  </div>
                ) : activeTab === 'businesses' ? (
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-muted-foreground mb-4">
                      {businesses.length} businesses found within 1km radius
                    </div>
                    {businesses.map((business) => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        onClick={handleBusinessClick}
                      />
                    ))}
                  </div>
                ) : activeTab === 'rent' ? (
                  <div className="p-6">
                    <RentLocationContent location={location} businessType={businessType} />
                  </div>
                ) : activeTab === 'ai-insight' ? (
                  <div className="h-full">
                    <AIAssistant onClose={() => setActiveTab('overview')} />
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Urban Development Analysis</h3>
                        <p className="text-muted-foreground">Infrastructure and development insights for this location.</p>
                      </div>
                      <div className="grid gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium text-foreground mb-2">Public Transportation</h4>
                          <p className="text-sm text-muted-foreground">Analysis of nearby transit options and accessibility.</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium text-foreground mb-2">Future Developments</h4>
                          <p className="text-sm text-muted-foreground">Planned infrastructure and construction projects in the area.</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium text-foreground mb-2">Amenities</h4>
                          <p className="text-sm text-muted-foreground">Nearby facilities, parks, schools, and shopping centers.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hamburger Button for Mobile */}
      {!isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="fixed top-32 left-4 z-10 p-3 bg-background rounded-full shadow-lg hover:shadow-xl transition-all lg:hidden btn-icon"
          aria-label="Open analysis panel"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Modals */}
      {selectedBusiness && (
        <BusinessDetail
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
          onRecenter={handleRecenterMap}
        />
      )}
    </div>
  );
};

export default LocationAnalysis;