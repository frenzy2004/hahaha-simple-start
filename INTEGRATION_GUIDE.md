# Unified API Integration Guide

This guide explains how to integrate the unified geospatial change detection API with the frontend application.

## Overview

The integration connects the React frontend with the Python FastAPI backend to provide:

- **Satellite Imagery Analysis**: Real-time satellite imagery with change detection
- **NDVI Analysis**: Vegetation index analysis with environmental insights
- **Google Maps Integration**: Interactive mapping with satellite data overlay
- **AI-Powered Recommendations**: Machine learning-based location insights

## Architecture

```
Frontend (React + TypeScript)
    ↓ HTTP/HTTPS
Unified API (FastAPI + Python)
    ↓
Sentinel Hub API (Satellite Data)
    ↓
Google Maps API (Geocoding + Places)
```

## Setup Instructions

### 1. Backend Setup

1. **Navigate to the dragonfly directory:**
   ```bash
   cd dragonfly
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `dragonfly` directory:
   ```env
   CLIENT_ID=your_sentinel_hub_client_id
   CLIENT_SECRET=your_sentinel_hub_client_secret
   ```

4. **Start the API server:**
   ```bash
   python unified_api.py
   ```
   
   Or use the provided scripts:
   - Windows: `start-api.bat`
   - PowerShell: `start-api.ps1`

### 2. Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Core Endpoints

- `GET /` - API information and status
- `GET /health` - Health check
- `POST /detect-change-enhanced` - Enhanced change detection
- `POST /analyze/ndvi` - NDVI analysis
- `GET /locations/search` - Location search
- `GET /models/info` - Available models

### Change Detection

```typescript
const result = await unifiedApiService.detectChange({
  location: "New York, NY",
  zoom_level: "City-Wide (0.025°)",
  resolution: "Standard (5m)",
  alpha: 0.4,
  model_type: "siamese_unet",
  use_pytorch: true,
});
```

### NDVI Analysis

```typescript
const result = await unifiedApiService.analyzeNDVI({
  location: "New York, NY",
  zoom_level: "City-Wide (0.025°)",
  resolution: "Standard (5m)",
  want_recommendations: true,
  want_visualizations: true,
  analysis_focus: "vegetation",
});
```

## Frontend Components

### 1. SatelliteAnalysis Component

Located at `src/components/SatelliteAnalysis.tsx`

**Features:**
- Real-time satellite imagery display
- Change detection visualization
- Multiple view modes (before/after/split/changes)
- Model comparison
- Interactive controls

**Usage:**
```tsx
<SatelliteAnalysis
  location={location}
  coordinates={coordinates}
  onAnalysisComplete={(data) => setSatelliteData(data)}
/>
```

### 2. NDVIAnalysis Component

Located at `src/components/NDVIAnalysis.tsx`

**Features:**
- NDVI statistics and trends
- Environmental insights
- AI recommendations
- Socioeconomic correlation
- Interactive analysis focus selection

**Usage:**
```tsx
<NDVIAnalysis
  location={location}
  coordinates={coordinates}
  onAnalysisComplete={(data) => setNdviData(data)}
/>
```

### 3. UnifiedApiService

Located at `src/services/unifiedApiService.ts`

**Features:**
- Type-safe API calls
- Error handling
- Request timeout management
- Response validation

## Integration Points

### 1. LocationAnalysis Page

The main analysis page (`src/pages/LocationAnalysis.tsx`) integrates:

- **Map View**: Google Maps with satellite data overlay
- **Analytics**: Business and demographic data
- **Urban Development**: NDVI and environmental analysis

### 2. Tab Integration

- **Map View**: Interactive mapping with satellite imagery
- **Analytics**: Business intelligence and market data
- **Urban Development**: NDVI analysis and environmental insights

### 3. Real-time Data Flow

1. User enters location
2. Frontend geocodes location using Google Maps
3. API fetches satellite imagery from Sentinel Hub
4. AI models analyze changes and generate insights
5. Frontend displays results with interactive visualizations

## Configuration

### API Configuration

Edit `src/config/api.ts` to customize:

- API endpoints
- Timeout settings
- Model configurations
- Error messages

### Environment Variables

Required environment variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_key_here

# Backend (dragonfly/.env)
CLIENT_ID=your_sentinel_hub_client_id
CLIENT_SECRET=your_sentinel_hub_client_secret
```

## Error Handling

The integration includes comprehensive error handling:

- **Network errors**: Connection timeouts and retries
- **API errors**: Status code handling and user-friendly messages
- **Data errors**: Validation and fallback mechanisms
- **User errors**: Input validation and guidance

## Performance Optimization

### Frontend

- Lazy loading of satellite imagery
- Caching of API responses
- Optimized re-renders with React.memo
- Debounced API calls

### Backend

- Model caching and reuse
- Async processing for heavy operations
- Response compression
- Database connection pooling

## Testing

### API Testing

```bash
# Test API health
curl http://localhost:8000/health

# Test change detection
curl -X POST http://localhost:8000/detect-change-enhanced \
  -H "Content-Type: application/json" \
  -d '{"location": "New York, NY"}'
```

### Frontend Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Deployment

### Development

1. Start API server: `python unified_api.py`
2. Start frontend: `npm run dev`
3. Access at: `http://localhost:5173`

### Production

1. Build frontend: `npm run build`
2. Deploy API with proper environment variables
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if API server is running
   - Verify API_BASE_URL configuration
   - Check network connectivity

2. **Satellite Data Unavailable**
   - Verify Sentinel Hub credentials
   - Check location coordinates
   - Try different zoom levels

3. **Google Maps Not Loading**
   - Verify Google Maps API key
   - Check API key permissions
   - Ensure billing is enabled

### Debug Mode

Enable debug logging:

```typescript
// In src/config/api.ts
export const DEBUG = true;
```

## Support

For issues and questions:

1. Check the console for error messages
2. Verify API server logs
3. Test individual API endpoints
4. Check environment variable configuration

## Future Enhancements

- Real-time satellite data streaming
- Advanced AI model integration
- Multi-temporal analysis
- Custom visualization tools
- Export functionality for reports
