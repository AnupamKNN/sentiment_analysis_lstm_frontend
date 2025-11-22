import axios from 'axios'
import type {
  HealthResponse,
  PredictRequest,
  PredictResponse,
  BatchPredictRequest,
  BatchPredictResponse,
  UploadResponse,
  EvaluationMetrics
} from '../types/api'

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://sentiment-analysis-lstm-0uqd.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export const apiService = {
  // Health check
  async getHealth(): Promise<HealthResponse> {
    const response = await api.get<HealthResponse>('/health')
    return response.data
  },

  // Get basic info
  async getInfo(): Promise<any> {
    const response = await api.get('/')
    return response.data
  },

  // Single prediction
  async predict(request: PredictRequest): Promise<PredictResponse> {
    const response = await api.post<PredictResponse>('/predict', request)
    return response.data
  },

  // Batch prediction with file path
  async batchPredict(request: BatchPredictRequest): Promise<BatchPredictResponse> {
    const response = await api.post<BatchPredictResponse>('/predict/batch', request)
    return response.data
  },

  // Upload CSV file for batch prediction (if backend supports it)
  async uploadAndPredict(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post<UploadResponse>('/predict/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 120000, // 2 minutes for file upload
    })
    return response.data
  },

  // Get evaluation metrics (if backend supports it)
  async getEvaluationMetrics(): Promise<EvaluationMetrics> {
    const response = await api.get<EvaluationMetrics>('/evaluation/latest')
    return response.data
  },

  // Download file
  async downloadFile(url: string): Promise<Blob> {
    const response = await api.get(url, {
      responseType: 'blob'
    })
    return response.data
  }
}

export default apiService