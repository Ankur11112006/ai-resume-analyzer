import React, { useState } from 'react';
import { FileText,BarChart3, Sparkles } from 'lucide-react';
import ResumeAnalyzer from './components/ResumeAnalyzer/ResumeAnalyzer';
import ResumeBuilder from './components/ResumeBuilder/ResumeBuilder';
import './App.css';

function App() {
  const [activeModule, setActiveModule] = useState('analyzer');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Resume Analyzer & Builder
                </h1>
                <p className="text-sm text-gray-600">Powered by Advanced AI & ML</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveModule('analyzer')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeModule === 'analyzer'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Resume Analyzer</span>
              </button>
              <button
                onClick={() => setActiveModule('builder')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeModule === 'builder'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Resume Builder</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeModule === 'analyzer' ? (
          <ResumeAnalyzer />
        ) : (
          <ResumeBuilder />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              AI Resume Analyzer & Builder - Built with React & Gemini AI
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Analyze, optimize, and build professional resumes with AI assistance
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;