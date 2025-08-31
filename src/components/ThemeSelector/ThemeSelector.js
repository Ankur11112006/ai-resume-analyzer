import React, { useState } from 'react';
import { X, Palette, FileText, AlertCircle } from 'lucide-react';
import PDFGenerator from '../../services/PDFGenerator';

const ThemeSelector = ({ onClose, onDownload, resumeText }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const themes = [
    {
      id: 'modern-blue',
      name: 'Modern Blue',
      description: 'Clean, professional design with blue accents',
      preview: 'bg-gradient-to-br from-blue-50 to-blue-100',
      accent: 'bg-blue-600',
      primaryColor: '#2563eb',
      secondaryColor: '#eff6ff'
    },
    {
      id: 'minimal-black',
      name: 'Minimal Black & White',
      description: 'Timeless, minimalist design for maximum readability',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
      accent: 'bg-gray-800',
      primaryColor: '#1f2937',
      secondaryColor: '#f9fafb'
    },
    {
      id: 'creative-gradient',
      name: 'Creative Gradient',
      description: 'Eye-catching design with vibrant gradients',
      preview: 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50',
      accent: 'bg-gradient-to-r from-purple-600 to-pink-600',
      primaryColor: '#7c3aed',
      secondaryColor: '#fdf4ff'
    },
    {
      id: 'classic-serif',
      name: 'Classic Serif',
      description: 'Traditional, elegant design with serif typography',
      preview: 'bg-gradient-to-br from-amber-50 to-orange-50',
      accent: 'bg-amber-700',
      primaryColor: '#b45309',
      secondaryColor: '#fffbeb'
    },
    {
      id: 'tech-green',
      name: 'Tech Green',
      description: 'Modern tech-focused design with green highlights',
      preview: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      accent: 'bg-emerald-600',
      primaryColor: '#059669',
      secondaryColor: '#ecfdf5'
    },
    {
      id: 'corporate-navy',
      name: 'Corporate Navy',
      description: 'Professional corporate style with navy blue theme',
      preview: 'bg-gradient-to-br from-slate-50 to-blue-50',
      accent: 'bg-slate-700',
      primaryColor: '#334155',
      secondaryColor: '#f8fafc'
    }
  ];

  const handleDownload = async (format) => {
    if (!selectedTheme) {
      setError('Please select a theme first');
      return;
    }
    
    const theme = themes.find(t => t.id === selectedTheme);
    setIsGenerating(true);
    setError('');
    
    try {
      if (format === 'pdf') {
        await PDFGenerator.generatePDF(
          resumeText, 
          theme, 
          `resume_${theme.name.toLowerCase().replace(/\s+/g, '_')}.pdf`
        );
      } else if (format === 'docx') {
        PDFGenerator.generateDocx(
          resumeText, 
          theme, 
          `resume_${theme.name.toLowerCase().replace(/\s+/g, '_')}.docx`
        );
      } else {
        // Fallback to text file
        const blob = new Blob([resumeText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume_${theme.name.toLowerCase().replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      // Close modal after successful download
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Download error:', error);
      setError(`Failed to generate ${format.toUpperCase()}: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Palette className="h-6 w-6 text-purple-600" />
            <h3 className="text-2xl font-semibold text-gray-900">Choose Resume Theme</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Theme Grid */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">
            Select a professional theme for your resume. Each theme is optimized for ATS compatibility.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {themes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => {
                  setSelectedTheme(theme.id);
                  setError(''); // Clear any errors when selecting theme
                }}
                className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 ${
                  selectedTheme === theme.id
                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-200 scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Theme Preview */}
                <div className={`${theme.preview} h-28 rounded-lg mb-4 relative overflow-hidden border border-gray-100`}>
                  <div className="absolute inset-0 p-4">
                    {/* Header section */}
                    <div className={`${theme.accent} h-3 w-20 rounded mb-3 opacity-80`}></div>
                    {/* Content lines */}
                    <div className="space-y-2">
                      <div className="bg-white bg-opacity-90 h-1.5 w-full rounded"></div>
                      <div className="bg-white bg-opacity-70 h-1.5 w-4/5 rounded"></div>
                      <div className="bg-white bg-opacity-50 h-1.5 w-3/5 rounded"></div>
                      {/* Bullet points simulation */}
                      <div className="flex items-center space-x-1 mt-2">
                        <div className="w-1 h-1 bg-white bg-opacity-60 rounded-full"></div>
                        <div className="bg-white bg-opacity-40 h-1 w-12 rounded"></div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-white bg-opacity-60 rounded-full"></div>
                        <div className="bg-white bg-opacity-40 h-1 w-16 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{theme.name}</h4>
                <p className="text-xs text-gray-600 mb-3">{theme.description}</p>
                
                {selectedTheme === theme.id && (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Selected</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Download Options */}
          {selectedTheme && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Download Your Resume</h4>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => handleDownload('pdf')}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleDownload('docx')}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating DOCX...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Download DOCX</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleDownload('txt')}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Download TXT</span>
                </button>
              </div>
              
              <p className="text-xs text-gray-600 text-center mt-4">
                PDF format recommended for job applications • DOCX for easy editing • TXT as backup
              </p>
            </div>
          )}
          
          {!selectedTheme && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Palette className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-500">Select a theme above to continue with download</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-t border-blue-200 p-4">
          <div className="flex items-start space-x-3 text-blue-800">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Pro Tips for Best Results:
              </p>
              <ul className="text-xs space-y-1 ml-2">
                <li>• PDF format maintains formatting across all devices and ATS systems</li>
                <li>• All themes are designed to pass ATS screening</li>
                <li>• Download may take a few seconds for PDF generation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;