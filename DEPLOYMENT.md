# Deployment Guide

## Quick Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Copy and edit environment file
   cp .env .env.local
   
   # Edit .env.local with your backend URL
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Verify backend connection:**
   - Ensure FastAPI backend is running on port 8000
   - Test health endpoint: `curl http://localhost:8000/health`
   - Check CORS settings allow frontend origin

## Backend Requirements

### Required Endpoints (Core)
- `GET /health` - Returns model status and version
- `GET /` - Basic API info
- `POST /predict` - Single text prediction
- `POST /predict/batch` - Batch processing with file paths

### Optional Endpoints (Enhanced Features)
```python
# Add to your FastAPI app for full functionality

@app.post("/predict/upload")
async def upload_and_predict(file: UploadFile = File(...)):
    # Handle file upload and batch processing
    # Return same format as /predict/batch with download_url

@app.get("/evaluation/latest")  
async def get_evaluation_metrics():
    # Return model performance metrics
    # Used by Dashboard page

@app.get("/download/outputs/{filename}")
async def download_file(filename: str):
    # Serve result files for download
```

## Production Build

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ folder to your hosting service
```

## Features Included

✅ **Landing Page** - Hero section with quick stats and CTAs  
✅ **Single Prediction** - Real-time text analysis with history  
✅ **Batch Processing** - CSV upload and server path methods  
✅ **Model Dashboard** - Performance charts and metrics  
✅ **About/Admin** - System info and settings  
✅ **Dark/Light Theme** - Persistent user preference  
✅ **Responsive Design** - Mobile and desktop optimized  
✅ **Accessibility** - ARIA labels and keyboard navigation  
✅ **Error Handling** - User-friendly error messages  
✅ **Testing Setup** - Vitest + React Testing Library  

## Technology Stack

- **React 18** + TypeScript
- **Vite** for build tooling  
- **Tailwind CSS** for styling
- **Material UI** components
- **Chart.js** for visualizations
- **Axios** for API calls
- **React Router** for navigation

## Next Steps

1. Start the development server and test all pages
2. Add the optional backend endpoints for enhanced features
3. Customize theme colors and branding as needed
4. Add any additional business logic or features
5. Deploy to production hosting service

The frontend is now complete and ready for use! 🚀