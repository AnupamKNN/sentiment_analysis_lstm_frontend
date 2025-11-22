import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessageSquare, Copy, Share2, Clock, Brain, TrendingUp, AlertCircle } from 'lucide-react'
import apiService from '../services/api'
import type { PredictResponse } from '../types/api'

interface PredictionHistory {
  id: string
  timestamp: Date
  text: string
  result: PredictResponse
}

const SinglePrediction: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [text, setText] = useState(searchParams.get('text') || '')
  const [result, setResult] = useState<PredictResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<PredictionHistory[]>([])

  const examples = [
    "I absolutely love this new product! It exceeded all my expectations.",
    "This service is terrible and I'm extremely disappointed.",
    "The weather today is okay, nothing special but not bad either.",
    "Amazing customer support! They helped me solve my problem quickly.",
    "I'm not sure how I feel about this new update."
  ]

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('prediction-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })))
      } catch (error) {
        console.error('Failed to load history:', error)
      }
    }
  }, [])

  const saveToHistory = (text: string, result: PredictResponse) => {
    const newEntry: PredictionHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      text,
      result
    }
    
    const updatedHistory = [newEntry, ...history].slice(0, 10) // Keep last 10
    setHistory(updatedHistory)
    localStorage.setItem('prediction-history', JSON.stringify(updatedHistory))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      setError('Please enter some text to analyze')
      return
    }
    
    if (text.length < 3) {
      setError('Text must be at least 3 characters long')
      return
    }
    
    if (text.length > 1000) {
      setError('Text must be less than 1000 characters')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiService.predict({ text })
      setResult(response)
      saveToHistory(text, response)
    } catch (error: any) {
      console.error('Prediction failed:', error)
      setError(error.response?.data?.detail || 'Failed to analyze text. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyResult = () => {
    if (result) {
      const textToCopy = `Text: "${result.text}"\nSentiment: ${result.sentiment}\nConfidence: ${(result.confidence * 100).toFixed(1)}%`
      navigator.clipboard.writeText(textToCopy)
    }
  }

  const handleShare = () => {
    if (result) {
      const shareText = `Sentiment Analysis: "${result.text}" → ${result.sentiment} (${(result.confidence * 100).toFixed(1)}% confidence)`
      if (navigator.share) {
        navigator.share({
          title: 'Sentiment Analysis Result',
          text: shareText
        })
      } else {
        navigator.clipboard.writeText(shareText)
        alert('Result copied to clipboard!')
      }
    }
  }

  const getSentimentColor = (sentiment: string) => {
    return sentiment === 'Positive' 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400'
  }

  const getSentimentBgColor = (sentiment: string) => {
    return sentiment === 'Positive'
      ? 'bg-green-100 dark:bg-green-900/20'
      : 'bg-red-100 dark:bg-red-900/20'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Text Sentiment Analysis
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Enter any text to analyze its emotional sentiment and get detailed insights
        </p>
      </div>

      {/* Main Form */}
      <div className="glass-card space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text to Analyze
            </label>
            <textarea
              id="text"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-field resize-none"
              placeholder="Enter your text here... (3-1000 characters)"
              maxLength={1000}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{text.length}/1000 characters</span>
              {text.length < 3 && text.length > 0 && (
                <span className="text-red-500">Minimum 3 characters required</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || text.length < 3 || text.length > 1000}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Analyze Sentiment
              </>
            )}
          </button>
        </form>

        {/* Example Texts */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Try these examples:
          </p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setText(example)}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-left"
              >
                "{example.slice(0, 50)}{example.length > 50 ? '...' : ''}"
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="glass-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Analysis Result
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopyResult}
                className="btn-secondary p-2"
                title="Copy result"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                className="btn-secondary p-2"
                title="Share result"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Analysis */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Original Text</h3>
                <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                  "{result.text}"
                </p>
              </div>
              
              {result.cleaned_text !== result.text && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Processed Text</h3>
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                    "{result.cleaned_text}"
                  </p>
                </div>
              )}
            </div>

            {/* Sentiment Results */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${getSentimentBgColor(result.sentiment)}`}>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sentiment</h3>
                  <p className={`text-3xl font-bold ${getSentimentColor(result.sentiment)}`}>
                    {result.sentiment}
                  </p>
                </div>
              </div>

            

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Confidence</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        result.sentiment === 'Positive' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Probability</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {(result.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${result.probability * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Processed in {result.processing_time_ms.toFixed(1)}ms</span>
                </div>
              </div>
            </div>
            
            {/* Legend explaining metrics (placed below the graphs) */}
            <div className="col-span-full mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 w-full">
              <p className="text-lg font-bold mb-2">Legend</p>
              <div className="space-y-1">
                <div>
                  <span className="font-bold">Confidence:</span> How certain the model is about its chosen sentiment (higher = more certain). Displayed as a percentage and progress bar.
                </div>
                <div>
                  <span className="font-bold">Probability:</span> The model's estimated probability for the predicted label (higher = more likely). Also shown as a percentage and bar.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="glass-card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Analysis History
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                onClick={() => setText(item.text)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      "{item.text}"
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`font-medium ${getSentimentColor(item.result.sentiment)}`}>
                        {item.result.sentiment}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {(item.result.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SinglePrediction