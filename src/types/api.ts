export type HealthResponse = {
  status: string
  model_loaded: boolean
  version: string
  model_version?: string | null
  last_trained?: string | null
}

export interface PredictRequest {
  text: string
}

export interface PredictResponse {
  text: string
  cleaned_text: string
  sentiment: 'Positive' | 'Negative'
  label: 0 | 1
  confidence: number
  probability: number
  processing_time_ms: number
}

export interface BatchPredictRequest {
  input_file: string
  output_file: string
}

export interface BatchPredictResponse {
  message: string
  input_file: string
  output_file: string
  total_records: number
  successful: number
  failed: number
  avg_confidence: number
  processing_time_minutes: number
  download_url?: string
}

export interface UploadResponse {
  message: string
  input_file: string
  output_file: string
  total_records: number
  successful: number
  failed: number
  avg_confidence: number
  processing_time_minutes: number
  download_url?: string
}

export interface EvaluationMetrics {
  model_name: string
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  auc_roc: number
  confusion_matrix: number[][]
  classification_report: string
  metrics_csv?: string
}

