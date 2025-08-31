#  AI Resume Analyzer & Builder

An intelligent, AI-powered web application that analyzes existing resumes against job descriptions and builds professional, ATS-optimized resumes from scratch. Built with React.js and integrated with Google's Gemini AI for advanced text processing and optimization.



##  Features

###  Resume Analyzer
- **Smart File Upload**: Supports PDF, DOCX, and TXT formats
- **AI-Powered Analysis**: Uses Gemini AI for intelligent resume evaluation
- **Comprehensive ATS Scoring**: 
  - Keyword Match Analysis (40%)
  - Formatting Compliance (20%)
  - Readability & Grammar (15%)
  - Section Completeness (15%)
  - Action Verbs Quality (10%)
- **Interactive Visualizations**: Real-time charts and progress indicators
- **Skill Gap Analysis**: Identifies matched, missing, and suggested skills
- **AI Resume Improvement**: Automatically generates enhanced versions
- **Professional Themes**: 6 beautiful, ATS-compatible themes


###  Resume Builder
- **Comprehensive Form Interface**: Guided input for all resume sections
- **Real-time Preview**: See your resume as you build it
- **AI Content Generation**: Smart suggestions and content optimization
- **Dynamic Sections**: Add/remove experiences, projects, certifications
- **Skill Management**: Interactive skill tagging system
- **Progress Tracking**: Visual completion indicators
- **Multi-format Export**: PDF and DOCX download options

##  Technology Stack

- **Frontend**: React.js 18.2.0
- **Styling**: Tailwind CSS with custom animations
- **AI Integration**: Google Gemini API
- **Charts**: Recharts for data visualization
- **File Processing**: Mammoth.js for DOCX, custom PDF processing
- **PDF Generation**: jsPDF for client-side PDF creation
- **Icons**: Lucide React icon library

##  Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-resume-analyzer-builder.git
   cd ai-resume-analyzer-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

##  Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env` file

##  Project Structure

```
src/
├── components/
│   ├── ResumeAnalyzer/
│   │   └── ResumeAnalyzer.js     # Main analyzer component
│   ├── ResumeBuilder/
│   │   └── ResumeBuilder.js      # Resume builder form
│   └── ThemeSelector/
│       └── ThemeSelector.js      # Theme selection modal
├── services/
│   ├── geminiService.js          # AI integration service
│   ├── fileProcessor.js          # File handling utilities
│   └──   PDFGenerator.js
├── App.js                        # Main application component
├── App.css                       # Global styles and animations
└── index.js                      # Application entry point
```

##  How It Works

### Resume Analysis Process
1. **File Upload**: Users upload resume and job description files
2. **Text Extraction**: Advanced parsing extracts clean text from various formats
3. **AI Analysis**: Gemini AI analyzes content for ATS compatibility
4. **Score Calculation**: Comprehensive scoring across 5 key metrics
5. **Recommendations**: AI provides specific improvement suggestions
6. **Resume Enhancement**: AI rewrites content with better formatting and language
7. **Theme Application**: Professional themes applied for download

### Resume Building Process
1. **Form Completion**: Users fill out comprehensive resume form
2. **AI Content Generation**: Gemini AI optimizes content and language
3. **Real-time Preview**: Live preview updates as users type
4. **Theme Selection**: Choose from 6 professional themes
5. **Export Options**: Download in PDF or DOCX format

##  Available Themes

1. **Modern Blue** - Clean, professional design with blue accents
2. **Minimal Black & White** - Timeless, minimalist design
3. **Creative Gradient** - Eye-catching design with vibrant gradients
4. **Classic Serif** - Traditional, elegant design with serif typography
5. **Tech Green** - Modern tech-focused design with green highlights
6. **Corporate Navy** - Professional corporate style with navy theme

##  ATS Scoring Algorithm

Our intelligent scoring system evaluates resumes across five critical dimensions:

- **Keyword Match (40%)**: Semantic analysis of job requirement alignment
- **Formatting Compliance (20%)**: ATS-friendly structure and consistency
- **Readability & Grammar (15%)**: Language quality and clarity assessment
- **Section Completeness (15%)**: Essential resume sections presence
- **Action Verbs Quality (10%)**: Impact and strength of language used

##  Advanced Features

### AI-Powered Improvements
- **Smart Text Enhancement**: Replaces weak language with powerful action verbs
- **Keyword Optimization**: Strategically incorporates missing job requirements
- **Grammar Correction**: Fixes grammatical errors and improves readability
- **ATS Optimization**: Ensures compatibility with applicant tracking systems

### Interactive Visualizations
- **Radial Progress Charts**: Visual ATS score representation
- **Bar Charts**: Detailed score breakdown by category
- **Skill Mapping**: Color-coded skill analysis (matched/missing/suggested)
- **Progress Indicators**: Real-time completion tracking

##  Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Popular Platforms

**Netlify:**
```bash
# Build the project
npm run build

# Drag and drop the 'build' folder to Netlify
```

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**GitHub Pages:**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"homepage": "https://yourusername.github.io/ai-resume-analyzer-builder",
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  Usage Examples

### Analyzing a Resume
1. Upload your resume (PDF/DOCX/TXT)
2. Upload job description or paste text
3. Click "Analyze Resume with AI"
4. Review detailed ATS score and recommendations
5. Generate improved version
6. Download with preferred theme

### Building a New Resume
1. Fill out personal information
2. Add skills, experience, education, projects
3. Click "Generate AI Resume"
4. Preview the generated content
5. Select a professional theme
6. Download in PDF or DOCX format

##  Privacy & Security

- **No Data Storage**: All processing happens client-side
- **Secure API Calls**: Encrypted communication with Gemini AI
- **File Privacy**: Uploaded files are processed locally
- **No Personal Data Retention**: Information is not stored permanently

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Support

If you encounter any issues:

1. Check that your Gemini API key is correctly configured
2. Ensure you have a stable internet connection
3. Verify file formats are supported (PDF, DOCX, TXT)
4. Try refreshing the page and clearing browser cache

##  Acknowledgments

- Google Gemini AI for intelligent text processing
- Tailwind CSS for beautiful, responsive design
- Recharts for interactive data visualizations
- The open-source community for amazing libraries

---

**Built with  for helping job seekers create outstanding resumes**

*Star ⭐ this repository if it helped you land your dream job!*