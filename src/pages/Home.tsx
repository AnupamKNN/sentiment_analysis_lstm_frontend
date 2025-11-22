import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, FileText, BarChart3, Activity, CheckCircle, Clock, RefreshCw } from 'lucide-react'
import apiService from '../services/api'
import type { HealthResponse } from '../types/api'

const Home: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null)

  // Formats timestamp into a readable date (e.g., "Nov 21, 2025, 05:11 AM")
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  // UPDATED: Formats timestamp into a Version/Build ID (e.g., "v.2025.11.21")
  const formatVersion = (versionString: string | undefined | null) => {
    if (!versionString) return 'v1.0.0' // Fallback default
    try {
      // If it's a timestamp, convert to Build ID format
      if (versionString.includes('T')) {
        const date = new Date(versionString)
        if (!isNaN(date.getTime())) {
            const yyyy = date.getFullYear()
            const mm = String(date.getMonth() + 1).padStart(2, '0')
            const dd = String(date.getDate()).padStart(2, '0')
            return `v.${yyyy}.${mm}.${dd}`
        }
      }
      // If it's already a clean string like "1.0.0", return as is
      return versionString.startsWith('v') ? versionString : `v${versionString}`
    } catch {
      return versionString
    }
  }

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await apiService.getHealth()
        setHealthData(data)
      } catch (error) {
        console.error('Failed to fetch health data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    setRefreshMessage(null)
    try {
      const data = await apiService.getHealth()
      setHealthData(data)
      if (data.model_loaded) {
        setRefreshMessage('Connection active — Metrics updated')
      } else {
        setRefreshMessage('Backend connected — Model loading...')
      }
    } catch (error) {
      console.error('Failed to contact backend:', error)
      setRefreshMessage('Backend unavailable. Retrying...')
    } finally {
      setRefreshing(false)
      window.setTimeout(() => setRefreshMessage(null), 4000)
    }
  }

  const stats = [
    {
      name: 'Model Build', // Renamed from "Model Version" to be more accurate
      // Now uses the formatter to look like a technical version number
      value: formatVersion(healthData?.model_version),
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      name: 'System Status',
      value: healthData ? (healthData.model_loaded ? 'Online & Ready' : 'Initializing') : (loading ? 'Checking...' : 'Offline'),
      icon: healthData?.model_loaded ? CheckCircle : Clock,
      color: healthData?.model_loaded ? 'text-green-600' : 'text-yellow-600',
      bgColor: healthData?.model_loaded ? 'bg-green-100 dark:bg-green-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      name: 'Last Training',
      // Shows the readable human date
      value: formatDate(healthData?.last_trained),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ]

  const features = [
    {
      title: 'Analyze Text',
      description: 'Get instant sentiment analysis for any text with confidence scores and detailed insights.',
      icon: MessageSquare,
      href: '/predict',
      color: 'bg-primary-600'
    },
    {
      title: 'Batch Upload',
      description: 'Upload CSV files for bulk sentiment analysis with downloadable results.',
      icon: FileText,
      href: '/batch',
      color: 'bg-accent-500'
    },
    {
      title: 'Model Dashboard',
      description: 'View performance metrics, confusion matrix, and ROC curves.',
      icon: BarChart3,
      href: '/dashboard',
      color: 'bg-purple-600'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            VelociSense Social Media Sentiment &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
              Trend Analysis
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Leverage advanced machine learning to understand emotions and trends in your text data. 
            Get real-time insights with confidence scores and detailed analytics.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/predict"
            className="btn-primary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Analyze Text
          </Link>
          <Link
            to="/batch"
            className="btn-secondary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Batch Upload
          </Link>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-lg px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Checking...' : 'Refresh Status'}
          </button>
        </div>

        {refreshMessage && (
          <div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300 animate-fade-in">
            {refreshMessage}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="glass-card hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Features Grid */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Everything you need for comprehensive sentiment analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.title}
                to={feature.href}
                className="glass-card hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Try It Widget */}
      <div className="glass-card text-center space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Try It Now
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Test our sentiment analysis with a quick example
          </p>
        </div>
        
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "I love this product!",
              "This is terrible",
              "Not sure how I feel about this"
            ].map((example) => (
              <Link
                key={example}
                to={`/predict?text=${encodeURIComponent(example)}`}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                "{example}"
              </Link>
            ))}
          </div>
          
          <Link
            to="/predict"
            className="inline-block text-primary-600 hover:text-primary-700 font-medium"
          >
            Or write your own →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home