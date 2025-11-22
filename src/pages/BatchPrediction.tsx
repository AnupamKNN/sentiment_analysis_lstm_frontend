import React, { useState, useRef, useEffect } from 'react'
import { Upload, FileText, Download, AlertCircle, CheckCircle, Clock, BarChart3, Link as LinkIcon } from 'lucide-react'
import apiService from '../services/api'

interface CSVRow {
  [key: string]: string
}

const BatchPrediction: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [useServerPath, setUseServerPath] = useState(false)
  
  // Inputs
  const [serverInputPath, setServerInputPath] = useState('')
  const [customFilename, setCustomFilename] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- AUTO-DOWNLOAD TRIGGER ---
  // FIX: Removed "!useServerPath" check. Now triggers for ANY method that returns csv_content.
  useEffect(() => {
    if (result?.csv_content) {
      handleDownloadContent()
    }
  }, [result])

  const parseCSV = (text: string): { headers: string[], data: CSVRow[] } => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) throw new Error('CSV file is empty')

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    
    const data = lines.slice(1, 6).map(line => { 
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const row: CSVRow = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      return row
    })

    return { headers, data }
  }

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file')
      return
    }

    setError(null)

    try {
      const text = await selectedFile.text()
      const { headers, data } = parseCSV(text)

      const hasTextColumn = headers.some(h => h.toLowerCase() === 'text')
      
      if (!hasTextColumn) {
        setError(`Invalid CSV format. Missing required column: "text". Found: ${headers.join(', ')}`)
        setFile(null)
        setCsvData([])
        setCsvHeaders([])
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      setFile(selectedFile)
      setCsvHeaders(headers)
      setCsvData(data)
    } catch (error) {
      setError('Failed to parse CSV file. Please ensure it\'s properly formatted.')
      console.error('CSV parse error:', error)
      setFile(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleUploadAndPredict = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await apiService.uploadAndPredict(file)
      setResult(response)
    } catch (error: any) {
      console.error('Upload failed:', error)
      if (error.response?.status === 404) {
        setError('Upload endpoint not available. Please contact administrator.')
      } else {
        setError(error.response?.data?.detail || 'Failed to process file. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleServerPathPredict = async () => {
    if (!serverInputPath.trim()) {
      setError('Please provide a file URL or server path')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await apiService.batchPredict({
        input_file: serverInputPath,
        output_file: 'temp_out.csv' // Backend handles content return now
      })
      setResult(response)
    } catch (error: any) {
      console.error('Batch prediction failed:', error)
      setError(error.response?.data?.detail || 'Failed to process batch prediction. If using a URL, ensure it points to a raw CSV.')
    } finally {
      setLoading(false)
    }
  }

  // --- DOWNLOAD HANDLER (Client-Side Blob) ---
  const handleDownloadContent = () => {
    if (!result?.csv_content) return;
    try {
      const blob = new Blob([result.csv_content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      let filename = customFilename.trim();
      if (!filename) {
        filename = result.filename || `results_${Date.now()}`;
      }
      if (!filename.endsWith('.csv')) filename += '.csv';
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to generate download file.');
    }
  }

  // Fallback for Server Path download URL (legacy support)
  const handleDownloadUrl = async () => {
    if (result?.download_url) {
        try {
            const blob = await apiService.downloadFile(result.download_url)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            
            let filename = customFilename.trim();
            if (!filename) {
                filename = result.output_file ? result.output_file.split('/').pop() : `results_${Date.now()}.csv`;
            }
            if (!filename.endsWith('.csv')) filename += '.csv';

            a.download = filename;
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Download failed:', error)
            setError('Failed to download results file')
        }
    }
  }

  const resetForm = () => {
    setFile(null)
    setCsvData([])
    setCsvHeaders([])
    setResult(null)
    setError(null)
    setServerInputPath('')
    setCustomFilename('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const KPICard = ({ label, value, color }: { label: string, value: string | number, color: 'blue' | 'green' | 'red' | 'purple' | 'indigo' }) => {
    const styles = {
      blue: { card: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800', text: 'text-blue-600 dark:text-blue-400', value: 'text-blue-900 dark:text-blue-100' },
      green: { card: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800', text: 'text-green-600 dark:text-green-400', value: 'text-green-900 dark:text-green-100' },
      red: { card: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800', text: 'text-red-600 dark:text-red-400', value: 'text-red-900 dark:text-red-100' },
      purple: { card: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800', text: 'text-purple-600 dark:text-purple-400', value: 'text-purple-900 dark:text-purple-100' },
      indigo: { card: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800', text: 'text-indigo-600 dark:text-indigo-400', value: 'text-indigo-900 dark:text-indigo-100' }
    }
    const style = styles[color] || styles.blue;
    return (
      <div className={`${style.card} p-4 rounded-lg border shadow-sm`}>
        <p className={`${style.text} text-sm font-medium`}>{label}</p>
        <p className={`${style.value} text-2xl font-bold`}>{value}</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Batch Sentiment Analysis
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Upload CSV files or use a URL for bulk sentiment analysis
        </p>
      </div>

      {/* Method Selection */}
      <div className="glass-card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Choose Input Method
        </h2>
        <div className="flex gap-6 justify-center">
          <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <input
              type="radio"
              value="upload"
              checked={!useServerPath}
              onChange={() => setUseServerPath(false)}
              className="mr-3 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Upload CSV File</span>
          </label>
          <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <input
              type="radio"
              value="server"
              checked={useServerPath}
              onChange={() => setUseServerPath(true)}
              className="mr-3 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">URL / Server Path</span>
          </label>
        </div>
      </div>

      {!useServerPath ? (
        /* Upload Section */
        <div className="glass-card space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upload CSV File
          </h2>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
              dragOver
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : file
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-4">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary-600 hover:text-primary-700 font-medium underline"
                >
                  Change File
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Drop your CSV file here
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    or click to browse
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                >
                  Choose File
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* File Naming */}
          <div className="space-y-2">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output Filename (Optional)</label>
             <input type="text" value={customFilename} onChange={e => setCustomFilename(e.target.value)} className="input-field" placeholder="e.g., my_analysis_results" />
          </div>

          {/* Preview Table */}
          {csvData.length > 0 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview (First 5 Rows)
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {csvHeaders.map((header, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {csvData.map((row, index) => (
                      <tr key={index}>
                        {csvHeaders.map((header, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 max-w-xs truncate">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <button
                onClick={handleUploadAndPredict}
                disabled={loading}
                className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5" />
                    Start Analysis
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* URL / Server Path Section */
        <div className="glass-card space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            URL / Server Path
          </h2>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
             <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
               <LinkIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
               Supported: Direct CSV links, Google Drive share links (must be public), or local server paths.
             </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                File Link or Path
              </label>
              <input
                type="text"
                value={serverInputPath}
                onChange={(e) => setServerInputPath(e.target.value)}
                className="input-field"
                placeholder="https://drive.google.com/... or /data/input.csv"
              />
            </div>
            
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Filename (Optional)</label>
               <input 
                 type="text" 
                 value={customFilename} 
                 onChange={e => setCustomFilename(e.target.value)} 
                 className="input-field" 
                 placeholder="e.g., url_analysis_results" 
               />
            </div>
            
            <button
              onClick={handleServerPathPredict}
              disabled={loading || !serverInputPath.trim()}
              className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  Start Analysis
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="glass-card space-y-6 animate-scale-in">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-7 h-7 text-green-500" />
              Analysis Complete
            </h2>
            <button onClick={resetForm} className="btn-secondary">
              Start New Analysis
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <KPICard label="Total Records" value={result.total_records?.toLocaleString() ?? '-'} color="blue" />
            <KPICard label="Successful" value={result.successful?.toLocaleString() ?? '-'} color="green" />
            <KPICard label="Failed" value={result.failed?.toLocaleString() ?? '-'} color="red" />
            <KPICard 
                label="Avg Confidence" 
                value={result.avg_confidence ? `${(result.avg_confidence * 100).toFixed(1)}%` : '0%'} 
                color="purple" 
            />
            <KPICard 
                label="Avg Probability" 
                value={result.avg_probability ? `${(result.avg_probability * 100).toFixed(1)}%` : '0%'} 
                color="indigo" 
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Processing time: {result.processing_time_minutes ? result.processing_time_minutes.toFixed(2) : '0'} minutes</span>
                </div>
                
                {/* Show output file path only for server method */}
                {useServerPath && result.output_file && !result.csv_content && (
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Output file: {result.output_file}</span>
                    </div>
                )}
            </div>
            
            {/* Download Button - Now shows for BOTH if content available */}
            {result.csv_content && (
                <button
                  onClick={handleDownloadContent}
                  className="btn-primary flex items-center gap-2 mt-4"
                >
                  <Download className="w-5 h-5" />
                  Download Results Again
                </button>
            )}
            
            {/* Legacy URL download */}
            {useServerPath && result.download_url && !result.csv_content && (
               <button
                  onClick={handleDownloadUrl}
                  className="btn-primary flex items-center gap-2 mt-4"
                >
                  <Download className="w-5 h-5" />
                  Download Results
                </button>
            )}
          </div>

          {result.message && !result.csv_content && !result.output_file && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {result.message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default BatchPrediction