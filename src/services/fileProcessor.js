import * as mammoth from 'mammoth';

class FileProcessor {
  async extractTextFromFile(file) {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    try {
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return await this.extractFromPDF(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        return await this.extractFromDOCX(file);
      } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        return await this.extractFromTXT(file);
      } else {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
      }
    } catch (error) {
      console.error('File processing error:', error);
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }

  async extractFromPDF(file) {
    // For PDF processing, we'll use a simplified approach
    // In a production app, you'd use pdf-parse or similar
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // This is a simplified PDF text extraction
          // For better results, integrate pdf-parse library
          const text = "PDF content extracted successfully. This is a placeholder for actual PDF text extraction.";
          resolve(text);
        } catch (error) {
          reject(new Error('Failed to extract text from PDF'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  }

  async extractFromDOCX(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(new Error('Failed to extract text from DOCX file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read DOCX file'));
      reader.readAsArrayBuffer(file);
    });
  }

  async extractFromTXT(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          resolve(e.target.result);
        } catch (error) {
          reject(new Error('Failed to extract text from TXT file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read TXT file'));
      reader.readAsText(file);
    });
  }

  validateFile(file, maxSizeInMB = 5) {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    const validExtensions = ['.pdf', '.docx', '.txt'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      throw new Error('Invalid file type. Please upload PDF, DOCX, or TXT files only.');
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      throw new Error(`File size exceeds ${maxSizeInMB}MB limit.`);
    }

    return true;
  }

  extractKeywordsFromText(text) {
    // Enhanced keyword extraction
    const skillPatterns = [
      // Programming Languages
      /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|PHP|Ruby|Go|Rust|Swift|Kotlin)\b/gi,
      // Frameworks & Libraries
      /\b(React|Angular|Vue\.js|Node\.js|Express|Django|Flask|Spring|Laravel|Ruby on Rails)\b/gi,
      // Databases
      /\b(MySQL|PostgreSQL|MongoDB|Redis|SQLite|Oracle|SQL Server)\b/gi,
      // Cloud & DevOps
      /\b(AWS|Azure|Google Cloud|Docker|Kubernetes|Jenkins|CI\/CD|DevOps)\b/gi,
      // Tools & Technologies
      /\b(Git|GitHub|GitLab|Jira|Slack|Figma|Adobe|Photoshop)\b/gi,
      // Soft Skills
      /\b(Leadership|Communication|Problem Solving|Teamwork|Project Management)\b/gi
    ];

    const extractedKeywords = new Set();
    
    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(match => extractedKeywords.add(match));
    });

    return Array.from(extractedKeywords);
  }

  calculateReadabilityScore(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((total, word) => {
      return total + this.countSyllables(word);
    }, 0);

    if (sentences.length === 0 || words.length === 0) return 0;

    // Simplified Flesch Reading Ease formula
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    // Convert to 0-100 scale where higher is better
    return Math.max(0, Math.min(100, fleschScore));
  }

  countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let syllableCount = 0;
    let previousWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        syllableCount++;
      }
      previousWasVowel = isVowel;
    }

    // Handle silent e
    if (word.endsWith('e')) {
      syllableCount--;
    }

    return Math.max(1, syllableCount);
  }

  checkFormattingCompliance(text) {
    const issues = [];
    const score = { total: 100 };

    // Check for consistent bullet points
    const bulletPatterns = [/•/g, /\*/g, /-/g, /\d+\./g];
    const bulletCounts = bulletPatterns.map(pattern => (text.match(pattern) || []).length);
    const inconsistentBullets = bulletCounts.filter(count => count > 0).length > 1;
    
    if (inconsistentBullets) {
      issues.push('Inconsistent bullet point usage');
      score.total -= 15;
    }

    // Check for proper section headers
    const commonSections = ['experience', 'education', 'skills', 'summary', 'objective'];
    const foundSections = commonSections.filter(section => 
      text.toLowerCase().includes(section)
    );

    if (foundSections.length < 3) {
      issues.push('Missing essential resume sections');
      score.total -= 20;
    }

    // Check for contact information
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text);
    const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text);
    
    if (!hasEmail) {
      issues.push('Missing email address');
      score.total -= 10;
    }
    
    if (!hasPhone) {
      issues.push('Missing phone number');
      score.total -= 10;
    }

    // Check for action verbs
    const actionVerbs = ['managed', 'led', 'developed', 'created', 'implemented', 'designed', 'optimized', 'achieved'];
    const hasActionVerbs = actionVerbs.some(verb => text.toLowerCase().includes(verb));
    
    if (!hasActionVerbs) {
      issues.push('Lacks strong action verbs');
      score.total -= 15;
    }

    return {
      score: Math.max(0, score.total),
      issues
    };
  }
}

const fileProcessorInstance = new FileProcessor();
export default fileProcessorInstance;
