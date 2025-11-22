import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { 
  Settings, 
  Sun, 
  Moon, 
  Brain, 
  Database,
  Code,
  BarChart3,
  Users,
  Zap
} from 'lucide-react'

const About: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  const features = [
    {
      icon: Brain,
      title: 'Advanced ML Models',
      description: 'LSTM with attention mechanism for accurate sentiment classification'
    },
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Fast prediction responses with sub-second processing times'
    },
    {
      icon: Database,
      title: 'Batch Processing',
      description: 'Handle large CSV files with thousands of text samples'
    },
    {
      icon: BarChart3,
      title: 'Performance Metrics',
      description: 'Comprehensive dashboard with accuracy, precision, recall, and ROC curves'
    },
    {
      icon: Code,
      title: 'REST API',
      description: 'Clean, documented API endpoints for easy integration'
    },
    {
      icon: Users,
      title: 'User-Friendly Interface',
      description: 'Intuitive web interface with dark/light theme support'
    }
  ]

  const technologies = [
    { name: 'Frontend', tech: 'React + TypeScript + Tailwind CSS' },
    { name: 'Backend', tech: 'FastAPI + Python' },
    { name: 'ML Framework', tech: 'TensorFlow/Keras + scikit-learn' },
    { name: 'Data Processing', tech: 'Pandas + NumPy' },
    { name: 'Visualization', tech: 'Chart.js + Material UI' },
    { name: 'Deployment', tech: 'Docker + Uvicorn' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          About VelociSense Analytics
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
          Social Media Sentiment & Trend Analysis Platform — An enterprise-grade solution that transforms 
          large-scale social media text into timely, actionable business intelligence.
        </p>
      </div>

      {/* Company Overview */}
      <div className="glass-card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          About VelociSense Analytics
        </h2>
        
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p className="text-lg leading-relaxed">
            Built around a scientific NLP research workflow and production-ready MLOps, the platform compares 
            preprocessing and modeling techniques, trains high-quality Keras LSTM (+ attention) models on the 
            Sentiment140 dataset (1.6M tweets), and serves predictions via a FastAPI backend for both single 
            and batch inference. Key outputs (metrics, plots, CSV exports) and notebooks live in the repository — 
            for example, see 01_data_exploration_preprocessing_comparison.ipynb for the EDA and dataset rationale.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                What We Do
              </h3>
              <p className="text-sm">
                Convert unstructured social media noise into structured intelligence for enterprise decision-making.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                Scale
              </h3>
              <p className="text-sm">
                Processes millions of posts daily across channels to surface sentiment trends, crisis signals, 
                and campaign impact.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary-600" />
                Approach
              </h3>
              <p className="text-sm">
                Scientific model-comparison + production MLOps — systematic preprocessing comparisons, feature 
                engineering experiments, and statistically validated model selection.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-600" />
                Platform Capabilities
              </h3>
              <p className="text-sm">
                Real-time single-text inference (POST /predict), CSV batch processing and upload with background 
                jobs (POST /predict/upload, /predict/upload/status/[job_id]), and evaluation endpoints 
                (GET /evaluation/latest) that feed dashboards and reports.
              </p>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary-600" />
                Compliance & Reliability
              </h3>
              <p className="text-sm">
                Designed for enterprise constraints — data privacy, auditability (MLflow-compatible tracking), 
                containerized deployment, and monitoring.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Empower enterprises to make faster, smarter, and more confident decisions by turning high-volume 
            social conversations into precise, actionable intelligence — delivered with scientific rigor, 
            operational reliability, and strict respect for data privacy.
          </p>
        </div>

        <div className="glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Vision
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Be the enterprise standard for social media intelligence: a trusted platform that blends cutting-edge 
            NLP research with production-grade MLOps to reveal emerging trends, anticipate reputation risks, and 
            drive measurable business impact across industries.
          </p>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="glass-card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Theme Settings
        </h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-gray-600" />
            ) : (
              <Moon className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-gray-700 dark:text-gray-300">Theme</span>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Features Overview */}
      <div className="glass-card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Platform Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="glass-card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Technology Stack
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technologies.map((tech, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-900 dark:text-white">
                {tech.name}
              </span>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {tech.tech}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Model Information */}
      <div className="glass-card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Model Architecture
        </h2>
        
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Model Details</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Architecture:</strong> LSTM with Attention Mechanism</li>
                <li>• <strong>Input:</strong> Preprocessed text sequences</li>
                <li>• <strong>Output:</strong> Binary sentiment classification (Positive/Negative)</li>
                <li>• <strong>Training Data:</strong> Social media posts and reviews</li>
                <li>• <strong>Preprocessing:</strong> Text cleaning, tokenization, padding</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Performance</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Accuracy:</strong> ~84% on test set</li>
                <li>• <strong>Inference Time:</strong> &lt; 100ms per prediction</li>
                <li>• <strong>Batch Processing:</strong> Supports thousands of texts</li>
                <li>• <strong>Memory Usage:</strong> Optimized for production deployment</li>
                <li>• <strong>Model Size:</strong> Compact for fast loading</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="glass-card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Usage Guidelines
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Best Practices</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Use clear, coherent sentences for best results</li>
              <li>• Minimum text length: 3 characters</li>
              <li>• Maximum text length: 1000 characters</li>
              <li>• For batch processing, ensure CSV has 'text' column</li>
              <li>• Monitor confidence scores for result quality</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Limitations</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Binary classification only (Positive/Negative)</li>
              <li>• Trained primarily on English text</li>
              <li>• May struggle with sarcasm or irony</li>
              <li>• Context-dependent meanings may be missed</li>
              <li>• Domain-specific language may affect accuracy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>
          Built with ❤️ using modern web technologies and machine learning best practices.
        </p>
        <p className="mt-2">
          For support or feature requests, please contact the development team.
        </p>
      </div>
    </div>
  )
}

export default About