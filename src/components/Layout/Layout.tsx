import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  Home, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Info, 
  Sun, 
  Moon, 
  Menu, 
  X 
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Analyze Text', href: '/predict', icon: MessageSquare },
    { name: 'Batch Upload', href: '/batch', icon: FileText },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'About', href: '/about', icon: Info },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 glass-card rounded-none border-r">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Sentiment AI
                </h1>
              </div>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive(item.href)
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={toggleTheme}
              className="flex-shrink-0 w-full group block focus:outline-none"
            >
              <div className="flex items-center">
                <div className="inline-flex">
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 glass-card rounded-none">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Sentiment AI
            </h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="glass-card rounded-none border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </Link>
                )
              })}
              <button
                onClick={toggleTheme}
                className="w-full group flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md"
              >
                {theme === 'light' ? (
                  <Moon className="mr-3 h-6 w-6" />
                ) : (
                  <Sun className="mr-3 h-6 w-6" />
                )}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout