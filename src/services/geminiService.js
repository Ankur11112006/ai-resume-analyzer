class GeminiService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async makeRequest(prompt) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async analyzeResume(resumeText, jobDescription) {
    const prompt = `
    As an ATS (Applicant Tracking System) expert, analyze this resume against the job description and provide a detailed breakdown.

    RESUME:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}

    Please provide your analysis in the following JSON format (respond with ONLY valid JSON):
    {
      "compositeScore": 85,
      "scores": {
        "keywordMatch": 75,
        "formatting": 90,
        "readability": 80,
        "completeness": 85,
        "actionVerbs": 70
      },
      "matchedSkills": ["JavaScript", "React", "Node.js"],
      "missingSkills": ["Python", "AWS", "Docker"],
      "suggestedSkills": ["TypeScript", "MongoDB", "GraphQL"],
      "formattingIssues": [
        "Use consistent bullet points",
        "Add more quantifiable achievements",
        "Improve action verb usage"
      ],
      "recommendations": [
        "Add specific metrics to achievements",
        "Include missing technical skills",
        "Optimize keywords for ATS scanning"
      ]
    }

    Calculate scores based on:
    - Keyword Match (40%): How many job requirements are mentioned
    - Formatting (20%): Professional structure, consistency, ATS-friendly
    - Readability (15%): Clear language, proper grammar
    - Completeness (15%): All relevant sections present
    - Action Verbs (10%): Strong, impactful language

    Provide specific, actionable recommendations.
    `;

    try {
      const response = await this.makeRequest(prompt);
      return JSON.parse(response);
    } catch (error) {
      // Fallback to rule-based analysis if API fails
      return this.fallbackAnalysis(resumeText, jobDescription);
    }
  }

  async improveResume(resumeText, jobDescription, analysisResults) {
    const prompt = `
    As a professional resume writer, improve this resume based on the analysis results. Make it more ATS-friendly and compelling.

    ORIGINAL RESUME:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}

    ANALYSIS RESULTS:
    Missing Skills: ${analysisResults.missingSkills?.join(', ')}
    Formatting Issues: ${analysisResults.formattingIssues?.join(', ')}
    Recommendations: ${analysisResults.recommendations?.join(', ')}

    Please provide an improved version that:
    1. Uses stronger action verbs
    2. Incorporates relevant missing skills naturally
    3. Adds quantifiable achievements where possible
    4. Improves ATS keyword density
    5. Maintains professional formatting
    6. Keeps the same overall structure but enhances content

    Respond with the improved resume text only, maintaining the original format and sections.
    `;

    try {
      const response = await this.makeRequest(prompt);
      return response.trim();
    } catch (error) {
      // Fallback to rule-based improvement
      return this.fallbackImprovement(resumeText, analysisResults);
    }
  }

  async generateResumeFromData(formData) {
    const prompt = `
    Create a professional, ATS-optimized resume using this information:

    PERSONAL INFO:
    Name: ${formData.name}
    Title: ${formData.title}
    Email: ${formData.email}
    Phone: ${formData.phone}
    Location: ${formData.location}
    LinkedIn: ${formData.linkedin || 'N/A'}
    GitHub: ${formData.github || 'N/A'}
    Portfolio: ${formData.portfolio || 'N/A'}

    SUMMARY: ${formData.summary || 'N/A'}
    
    SKILLS: ${formData.skills?.join(', ') || 'N/A'}
    
    EDUCATION: ${JSON.stringify(formData.education || [])}
    
    EXPERIENCE: ${JSON.stringify(formData.experience || [])}
    
    PROJECTS: ${JSON.stringify(formData.projects || [])}
    
    CERTIFICATIONS: ${JSON.stringify(formData.certifications || [])}

    Create a professional resume with:
    - Clean, ATS-friendly formatting
    - Strong action verbs
    - Quantified achievements where possible
    - Professional summary if provided
    - Well-organized sections
    - Proper spacing and structure

    Format as clean text with clear section headers.
    `;

    try {
      const response = await this.makeRequest(prompt);
      return response.trim();
    } catch (error) {
      // Fallback to template-based generation
      return this.fallbackResumeGeneration(formData);
    }
  }

  // Fallback methods for when API is unavailable
  fallbackAnalysis(resumeText, jobDescription) {
    const keywords = this.extractKeywords(jobDescription);
    const resumeWords = resumeText.toLowerCase().split(/\s+/);
    const matchedSkills = keywords.filter(keyword => 
      resumeWords.some(word => word.includes(keyword.toLowerCase()))
    );
    
    return {
      compositeScore: Math.min(90, 50 + matchedSkills.length * 5),
      scores: {
        keywordMatch: Math.min(100, matchedSkills.length * 10),
        formatting: 85,
        readability: 80,
        completeness: 75,
        actionVerbs: 70
      },
      matchedSkills: matchedSkills.slice(0, 8),
      missingSkills: keywords.filter(k => !matchedSkills.includes(k)).slice(0, 5),
      suggestedSkills: ['Communication', 'Leadership', 'Problem Solving'],
      formattingIssues: [
        'Consider adding more quantifiable achievements',
        'Use consistent bullet points throughout',
        'Ensure proper section spacing'
      ],
      recommendations: [
        'Add specific metrics to achievements',
        'Include missing technical skills',
        'Optimize keywords for ATS scanning'
      ]
    };
  }

  fallbackImprovement(resumeText, analysisResults) {
    let improved = resumeText;
    
    // Replace weak verbs with strong ones
    const verbReplacements = {
      'responsible for': 'managed',
      'worked on': 'developed',
      'helped with': 'assisted in',
      'did': 'executed',
      'made': 'created',
      'handled': 'managed'
    };

    Object.entries(verbReplacements).forEach(([weak, strong]) => {
      improved = improved.replace(new RegExp(weak, 'gi'), strong);
    });

    return improved;
  }

  fallbackResumeGeneration(formData) {
    let resume = `${formData.name}\n`;
    resume += `${formData.title}\n`;
    resume += `${formData.email} | ${formData.phone} | ${formData.location}\n`;
    
    if (formData.linkedin) resume += `LinkedIn: ${formData.linkedin}\n`;
    if (formData.github) resume += `GitHub: ${formData.github}\n`;
    if (formData.portfolio) resume += `Portfolio: ${formData.portfolio}\n`;
    
    resume += `\n--- PROFESSIONAL SUMMARY ---\n`;
    resume += formData.summary || 'Dedicated professional with strong technical skills and proven track record of success.';
    
    if (formData.skills?.length) {
      resume += `\n\n--- TECHNICAL SKILLS ---\n`;
      resume += formData.skills.join(', ');
    }
    
    // Add other sections...
    return resume;
  }

  extractKeywords(text) {
    const commonSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 
      'Git', 'MongoDB', 'TypeScript', 'Vue.js', 'Angular', 'Express',
      'Communication', 'Leadership', 'Problem Solving', 'Teamwork'
    ];
    
    return commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
  }
}

const geminiServiceInstance = new GeminiService();
export default geminiServiceInstance;
