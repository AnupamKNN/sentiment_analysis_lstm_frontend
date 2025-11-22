import { FC } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import SinglePrediction from './pages/SinglePrediction'
import BatchPrediction from './pages/BatchPrediction'
import ModelDashboard from './pages/ModelDashboard'
import About from './pages/About'

const App: FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<SinglePrediction />} />
            <Route path="/batch" element={<BatchPrediction />} />
            <Route path="/dashboard" element={<ModelDashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App