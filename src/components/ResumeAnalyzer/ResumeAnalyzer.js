import React, { useState } from 'react';
import { Upload, FileText, Target, Download, Sparkles, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import FileProcessor from '../../services/fileProcessor';
import GeminiService from '../../services/geminiService';
import ThemeSelector from '../ThemeSelector/ThemeSelector';

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescFile, setJobDescFile] = useState(null);
  const [jobDescText, setJobDescText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [improvedResume, setImprovedResume] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [error, setError] = useState('');

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        FileProcessor.validateFile(file);
        setResumeFile(file);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleJobDescUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        FileProcessor.validateFile(file);
        setJobDescFile(file);
        setJobDescText(''); // Clear text input when file is uploaded
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const analyzeResume = async () => {
    if (!resumeFile || (!jobDescFile && !jobDescText.trim())) {
      setError('Please upload a resume and provide a job description');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Extract text from resume
      const resumeContent = await FileProcessor.extractTextFromFile(resumeFile);
      setResumeText(resumeContent);

      // Get job description text
      let jobDesc = jobDescText.trim();
      if (jobDescFile) {
        jobDesc = await FileProcessor.extractTextFromFile(jobDescFile);
      }

      // Analyze with Gemini AI
      const analysis = await GeminiService.analyzeResume(resumeContent, jobDesc);
      setAnalysisResults(analysis);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateImprovedResume = async () => {
    if (!resumeText || !analysisResults) return;

    setIsImproving(true);
    try {
      let jobDesc = jobDescText.trim();
      if (jobDescFile) {
        jobDesc = await FileProcessor.extractTextFromFile(jobDescFile);
      }

      const improved = await GeminiService.improveResume(resumeText, jobDesc, analysisResults);
      setImprovedResume(improved);
    } catch (err) {
      setError(err.message || 'Failed to improve resume');
    } finally {
      setIsImproving(false);
    }
  };

  const downloadImprovedResume = () => {
    if (!improvedResume) return;
    setShowThemeSelector(true);
  };

  const handleThemeDownload = (theme, format) => {
    // Create a downloadable file with the improved resume
    const blob = new Blob([improvedResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `improved_resume_${theme.name.toLowerCase().replace(/\s+/g, '_')}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowThemeSelector(false);
  };

  // Chart data preparation
  const scoreData = analysisResults ? [
    { name: 'Keyword Match', value: analysisResults.scores.keywordMatch, color: '#3B82F6' },
    { name: 'Formatting', value: analysisResults.scores.formatting, color: '#10B981' },
    { name: 'Readability', value: analysisResults.scores.readability, color: '#F59E0B' },
    { name: 'Completeness', value: analysisResults.scores.completeness, color: '#EF4444' },
    { name: 'Action Verbs', value: analysisResults.scores.actionVerbs, color: '#8B5CF6' }
  ] : [];

  const radialData = analysisResults ? [
    { name: 'ATS Score', value: analysisResults.compositeScore, fill: '#3B82F6' }
  ] : [];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Resume Analyzer</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Upload your resume and job description to get an comprehensive ATS score analysis 
          with AI-powered recommendations and improvements.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Upload Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Resume Upload */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Upload Resume</h3>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleResumeUpload}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
            >
              Click to upload resume
            </label>
            <p className="text-sm text-gray-500 mt-2">PDF, DOCX, or TXT (Max 5MB)</p>
            {resumeFile && (
              <div className="mt-3 flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{resumeFile.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Job Description Input */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Job Description</h3>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleJobDescUpload}
                className="hidden"
                id="job-desc-upload"
              />
              <label
                htmlFor="job-desc-upload"
                className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium"
              >
                Upload JD File
              </label>
              <p className="text-xs text-gray-500 mt-1">PDF or TXT</p>
              {jobDescFile && (
                <div className="mt-2 flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{jobDescFile.name}</span>
                </div>
              )}
            </div>
            
            <div className="text-center text-gray-500 font-medium">OR</div>
            
            <textarea
              placeholder="Paste job description text here..."
              value={jobDescText}
              onChange={(e) => {
                setJobDescText(e.target.value);
                if (e.target.value.trim()) setJobDescFile(null); // Clear file when typing
              }}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="text-center">
        <button
          onClick={analyzeResume}
          disabled={isAnalyzing || !resumeFile || (!jobDescFile && !jobDescText.trim())}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center space-x-3 mx-auto"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Analyze Resume with AI</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="space-y-8">
          {/* ATS Score Overview - FIXED LAYOUT */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">ATS Compatibility Analysis</h3>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Composite Score - FIXED */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart 
                        cx="50%" 
                        cy="50%" 
                        innerRadius="70%" 
                        outerRadius="90%" 
                        startAngle={90} 
                        endAngle={450}
                        data={radialData}
                      >
                        <RadialBar 
                          dataKey="value" 
                          cornerRadius={10} 
                          fill="#3B82F6"
                          stroke="#1E40AF"
                          strokeWidth={2}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Score Display - Positioned Outside Chart */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {analysisResults.compositeScore}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">ATS Score</div>
                  </div>
                </div>
                
                <div className={`mt-6 text-xl font-semibold px-4 py-2 rounded-full ${
                  analysisResults.compositeScore >= 80 ? 'text-green-700 bg-green-100' :
                  analysisResults.compositeScore >= 60 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'
                }`}>
                  {analysisResults.compositeScore >= 80 ? 'Excellent' :
                   analysisResults.compositeScore >= 60 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>

              {/* Score Breakdown */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Detailed Score Breakdown</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Score']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: '#f9fafb', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#3B82F6" 
                        radius={[4, 4, 0, 0]}
                      >
                        {scoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Matched Skills */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="text-lg font-semibold text-green-800">Matched Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResults.matchedSkills?.map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center space-x-2 mb-4">
                <XCircle className="h-5 w-5 text-red-600" />
                <h4 className="text-lg font-semibold text-red-800">Missing Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResults.missingSkills?.map((skill, index) => (
                  <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Skills */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-blue-800">AI Suggested Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResults.suggestedSkills?.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">AI Recommendations</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-700 mb-3">Formatting Issues</h5>
                <ul className="space-y-2">
                  {analysisResults.formattingIssues?.map((issue, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700 mb-3">Improvement Suggestions</h5>
                <ul className="space-y-2">
                  {analysisResults.recommendations?.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Generate Improved Resume Button */}
          <div className="text-center">
            <button
              onClick={generateImprovedResume}
              disabled={isImproving}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center space-x-3 mx-auto"
            >
              {isImproving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>AI is improving your resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate AI-Improved Resume</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Improved Resume Preview */}
      {improvedResume && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-semibold text-gray-900">AI-Improved Resume Preview</h4>
            <button
              onClick={downloadImprovedResume}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Improved Resume</span>
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
              {improvedResume}
            </pre>
          </div>
        </div>
      )}

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <ThemeSelector
          onClose={() => setShowThemeSelector(false)}
          onDownload={handleThemeDownload}
          resumeText={improvedResume}
        />
      )}
    </div>
  );
};

export default ResumeAnalyzer;