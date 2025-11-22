# Sentiment Analysis Frontend

A modern React + TypeScript frontend for the Sentiment Analysis Platform, providing an intuitive interface for real-time text sentiment analysis and batch processing capabilities.

## Features

- **Single Text Analysis**: Real-time sentiment prediction with confidence scores
- **Batch Processing**: Upload CSV files for bulk sentiment analysis
- **Model Dashboard**: Comprehensive performance metrics and visualizations
- **Dark/Light Theme**: User-configurable theme with persistence
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessible UI**: ARIA attributes, keyboard navigation, and high contrast support

## Tech Stack

- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Material UI** components for polished interactions
- **Chart.js + react-chartjs-2** for data visualizations
- **Axios** for HTTP requests
- **React Router** for client-side routing

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn package manager
- Backend API running (default: http://localhost:8000)

### Installation

1. **Clone and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env .env.local
   ```
   
   Edit `.env.local` if needed:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_MLFLOW_TRACKING_URI=http://localhost:5000  # Optional
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Navigate to http://localhost:3000

### Backend Connection

The frontend expects the following API endpoints to be available:

#### Required Endpoints (Core Functionality)
- `GET /health` - System health and model status
- `GET /` - Basic API information
- `POST /predict` - Single text prediction
- `POST /predict/batch` - Batch prediction with server file paths

#### Optional Endpoints (Enhanced Features)
- `POST /predict/upload` - File upload for batch prediction
- `GET /evaluation/latest` - Model evaluation metrics
- `GET /download/outputs/*` - Download result files

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run lint:fix` - Auto-fix linting issues

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   └── Layout/       # Navigation and layout
│   ├── contexts/         # React contexts (theme, etc.)
│   ├── pages/           # Page components
│   │   ├── Home.tsx          # Landing page
│   │   ├── SinglePrediction.tsx  # Text analysis
│   │   ├── BatchPrediction.tsx   # Batch upload
│   │   ├── ModelDashboard.tsx    # Performance metrics
│   │   └── About.tsx             # System information
│   ├── services/        # API integration
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── package.json
└── README.md
```

## API Integration

### Single Prediction Example

```typescript
import apiService from './services/api'

const result = await apiService.predict({ 
  text: "I love this product!" 
})

console.log(result.sentiment)     // "Positive"
console.log(result.confidence)    // 0.95
console.log(result.probability)   // 0.98
```

### Batch Processing Example

```typescript
// Option 1: File Upload (requires /predict/upload endpoint)
const file = event.target.files[0] // CSV file
const result = await apiService.uploadAndPredict(file)

// Option 2: Server File Path (uses existing /predict/batch)
const result = await apiService.batchPredict({
  input_file: "/path/to/input.csv",
  output_file: "/path/to/output.csv"
})
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend API base URL |
| `VITE_MLFLOW_TRACKING_URI` | - | MLflow tracking server URL (optional) |

## Backend Enhancements

To enable full functionality, consider adding these optional endpoints to your FastAPI backend:

### File Upload Endpoint

```python
from fastapi import UploadFile, File
import tempfile
import os

@app.post("/predict/upload")
async def upload_and_predict(file: UploadFile = File(...)):
    # Save uploaded file to temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        input_path = tmp_file.name
    
    # Generate output path
    output_path = input_path.replace('.csv', '_predictions.csv')
    
    # Use existing batch prediction logic
    result = await batch_predict_logic(input_path, output_path)
    
    # Add download URL
    result["download_url"] = f"/download/outputs/{os.path.basename(output_path)}"
    
    return result
```

### Evaluation Metrics Endpoint

```python
@app.get("/evaluation/latest")
async def get_latest_evaluation():
    # Read from training_results/*_metrics.csv or model metadata
    return {
        "model_name": "LSTM + Attention",
        "accuracy": 0.838,
        "precision": 0.84,
        "recall": 0.83,
        "f1_score": 0.835,
        "auc_roc": 0.90,
        "confusion_matrix": [[1000, 200], [150, 1200]],
        "classification_report": "...",
    }
```

### File Download Endpoint

```python
from fastapi.responses import FileResponse

@app.get("/download/outputs/{filename}")
async def download_file(filename: str):
    file_path = f"/path/to/outputs/{filename}"
    return FileResponse(file_path, filename=filename)
```

## Styling & Theming

The app uses Tailwind CSS with a custom color palette:

- **Primary**: Teal/Navy (`primary-*` classes)
- **Accent**: Orange (`accent-*` classes)
- **Glass Effect**: Backdrop blur with transparency
- **Dark Mode**: Automatic theme switching with localStorage persistence

### Custom CSS Classes

- `.glass` - Glass morphism background
- `.glass-card` - Glass card with padding
- `.btn-primary` - Primary button styles
- `.btn-secondary` - Secondary button styles
- `.input-field` - Consistent input styling

## Testing

Basic component and integration tests are included:

```bash
# Run tests (when implemented)
npm test

# Run e2e tests with Cypress (optional)
npx cypress open
```

## Accessibility Features

- ARIA labels and roles for screen readers
- Keyboard navigation support
- High contrast colors in both themes
- Focus indicators on interactive elements
- Semantic HTML structure

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations

- Code splitting with React.lazy (ready for implementation)
- Image optimization and lazy loading
- Efficient re-rendering with React.memo
- Tailwind CSS purging for smaller bundle size
- Vite's fast HMR for development

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deploy to Static Hosting

The built files can be deployed to any static hosting service:

- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload `dist/` contents
- **GitHub Pages**: Use GitHub Actions

### Environment Configuration

For production, set the correct API base URL:

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check that backend is running on the configured port
   - Verify CORS settings in FastAPI backend
   - Confirm API base URL in environment variables

2. **File Upload Not Working**
   - Ensure backend has `/predict/upload` endpoint
   - Check file size limits
   - Verify CSV format (comma-separated with headers)

3. **Charts Not Displaying**
   - Check browser console for JavaScript errors
   - Ensure evaluation metrics endpoint returns valid data
   - Verify Chart.js compatibility with React 18

4. **Theme Not Persisting**
   - Check localStorage permissions
   - Verify ThemeProvider wraps the app component

### Getting Help

- Check browser console for error messages
- Verify network requests in DevTools
- Ensure backend API is accessible and responding
- Review this README for configuration requirements

## Contributing

1. Follow TypeScript best practices
2. Use Prettier for code formatting
3. Add proper error handling
4. Include ARIA attributes for accessibility
5. Test on both light and dark themes

## License

This project is part of the Sentiment Analysis Platform. See main project for license details.