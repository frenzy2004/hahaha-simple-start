# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start the API Server

**Option A: Use the provided scripts (Recommended)**
```bash
# Windows
start-api.bat

# PowerShell
start-api.ps1
```

**Option B: Manual start**
```bash
cd dragonfly
pip install -r requirements.txt
python unified_api.py
```

### 2. Start the Frontend

```bash
npm run dev
```

### 3. Open Your Browser

Navigate to: `http://localhost:5173`

## ✅ What You'll See

- **Map View**: Interactive Google Maps with satellite data
- **Analytics**: Business intelligence and market analysis  
- **Urban Development**: NDVI environmental analysis
- **Satellite Data**: Real-time change detection

## 🔧 Troubleshooting

### API Not Running?
- Check if Python is installed: `python --version`
- Install dependencies: `pip install -r requirements.txt`
- Check the console for error messages

### Frontend Issues?
- Install dependencies: `npm install`
- Check if port 5173 is available
- Clear browser cache

### No Satellite Data?
- The app will show mock data if the API isn't running
- Start the API server to get real satellite analysis
- Check the API status indicator in the top-right corner

## 📊 Features Available

### With API Running:
- ✅ Real-time satellite imagery
- ✅ AI-powered change detection
- ✅ NDVI environmental analysis
- ✅ Interactive visualizations
- ✅ AI recommendations

### Without API (Mock Mode):
- ✅ Google Maps integration
- ✅ Business data analysis
- ✅ Mock satellite data
- ✅ Basic visualizations

## 🎯 Next Steps

1. **Get Sentinel Hub credentials** for real satellite data
2. **Configure Google Maps API** for full functionality
3. **Explore the analysis features** in each tab
4. **Download PDF reports** of your analysis

## 📞 Need Help?

- Check the console for error messages
- Verify all services are running
- Review the INTEGRATION_GUIDE.md for detailed setup
- Ensure all environment variables are set

Happy analyzing! 🛰️
