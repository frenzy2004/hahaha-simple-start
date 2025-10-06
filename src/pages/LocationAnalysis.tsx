import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Download, ArrowLeft } from 'lucide-react';
import TabNavigation from '../components/TabNavigation';
import GoogleMap from '../components/GoogleMap';
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
import jsPDF from 'jspdf';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'businesses' | 'rent'>('overview');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [actualLocation, setActualLocation] = useState<Location | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
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
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 10;

      // Title page
      pdf.setFontSize(24);
      pdf.text('Location Analysis Report', margin, 30);
      pdf.setFontSize(16);
      pdf.text(`Location: ${location}`, margin, 50);
      pdf.text(`Business Type: ${businessType}`, margin, 60);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 70);

      // Success Score
      pdf.setFontSize(18);
      pdf.text('Overall Success Score', margin, 90);
      pdf.setFontSize(48);
      pdf.text(`${analysis.successScore}/100`, margin, 110);

      // KPIs
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.text('Key Performance Indicators', margin, 30);
      pdf.setFontSize(12);
      
      let yPos = 50;
      pdf.text(`Average Rating: ${analysis.kpis.avgRating}/5`, margin, yPos);
      yPos += 10;
      pdf.text(`Monthly Demand: ${analysis.kpis.monthlyDemand.toLocaleString()}`, margin, yPos);
      yPos += 10;
      pdf.text(`Competitor Count: ${analysis.kpis.competitorCount}`, margin, yPos);
      yPos += 10;
      pdf.text(`Revenue Potential: RM ${analysis.kpis.revenuePotential.toLocaleString()}`, margin, yPos);

      // Demographics
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.text('Demographics', margin, 30);
      pdf.setFontSize(12);
      pdf.text(`Office Workers: ${analysis.demographics.office}%`, margin, 50);
      pdf.text(`Residents: ${analysis.demographics.residents}%`, margin, 60);

      pdf.save('location-analysis-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
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
            className="p-2.5 hover:bg-muted rounded-lg transition-all duration-200"
            aria-label="Go back to location request"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-2.5 hover:bg-muted rounded-lg transition-all duration-200 lg:hidden"
            aria-label={isPanelOpen ? 'Close analysis panel' : 'Open analysis panel'}
          >
            {isPanelOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
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
            className="flex items-center gap-2 px-4 py-2.5 bg-success text-white rounded-lg hover:bg-success-hover transition-all duration-200 disabled:opacity-50 font-medium shadow-sm hover:shadow"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{isDownloading ? 'Generating...' : 'Download PDF'}</span>
          </button>
          <button
            onClick={() => setShowAIAssistant(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all duration-200 font-medium shadow-sm hover:shadow"
            aria-label="Open AI Assistant"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Analysis Panel */}
        <div
          className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
            isPanelOpen
              ? 'w-full lg:w-1/2 xl:w-2/5'
              : 'w-0 lg:w-1/2 xl:w-2/5'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between lg:justify-start gap-4">
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex-1 lg:flex-none">
                  <h2 className="text-lg font-semibold text-gray-900">Analysis Dashboard</h2>
                  <p className="text-sm text-gray-600">{businessType} in {location}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex mt-4 bg-gray-100 rounded-lg p-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('businesses')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'businesses'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Competitor Nearby
                </button>
                <button
                  onClick={() => setActiveTab('rent')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'rent'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Rent Location
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'overview' ? (
                <div className="p-6 space-y-8">
                  <SuccessScoreChart score={analysis.successScore} />
                  <KPICards kpis={analysis.kpis} />
                  <SeasonalDemandChart data={analysis.seasonalDemand} />
                  <DemographicChart data={analysis.demographics} />
                  <CompetitorChart data={analysis.competitors} />
                  <LocationProfileChart data={analysis.locationProfile} />
                  <CompetitionDensityChart data={analysis.competitionDensity} />
                </div>
              ) : activeTab === 'businesses' ? (
                <div className="p-6 space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
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
              ) : (
                <div className="p-6">
                  <RentLocationContent location={location} businessType={businessType} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isPanelOpen ? 'lg:flex-1' : 'flex-1'
          }`}
        >
          {isGeocoding ? (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-gray-600">Finding location...</div>
              </div>
            </div>
          ) : (
            <GoogleMap
              location={analysis.location}
              businesses={businesses}
              onBusinessClick={handleBusinessClick}
              className="w-full h-full"
            />
          )}
        </div>
      </div>

      {/* Hamburger Button for Mobile */}
      {!isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="fixed top-32 left-4 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all lg:hidden"
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

      {showAIAssistant && <AIAssistant onClose={() => setShowAIAssistant(false)} />}
    </div>
  );
};

export default LocationAnalysis;