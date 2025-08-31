import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';


class PDFGenerator {
  constructor() {
    this.pageMargin = 20;
    this.lineHeight = 6;
    this.currentY = this.pageMargin;
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.maxWidth = this.pageWidth - (this.pageMargin * 2);
  }

  generatePDF(resumeText, theme, fileName = 'resume.pdf') {
    try {
      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Set theme colors and fonts
      this.applyTheme(pdf, theme);
      
      // Reset Y position
      this.currentY = this.pageMargin;
      
      // Parse and format resume content
      const sections = this.parseResumeContent(resumeText);
      
      // Generate PDF content
      this.generateContent(pdf, sections, theme);
      
      // Save the PDF
      pdf.save(fileName);
      
      return true;
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error('Failed to generate PDF: ' + error.message);
    }
  }

  applyTheme(pdf, theme) {
    // Set default font
    pdf.setFont('helvetica');
    
    // Theme-specific configurations
    switch (theme.id) {
      case 'modern-blue':
        this.primaryColor = [37, 99, 235]; // Blue
        this.accentColor = [59, 130, 246];
        break;
      case 'minimal-black':
        this.primaryColor = [31, 41, 55]; // Dark gray
        this.accentColor = [107, 114, 128];
        break;
      case 'creative-gradient':
        this.primaryColor = [124, 58, 237]; // Purple
        this.accentColor = [147, 51, 234];
        break;
      case 'classic-serif':
        this.primaryColor = [180, 83, 9]; // Amber
        this.accentColor = [217, 119, 6];
        pdf.setFont('times');
        break;
      case 'tech-green':
        this.primaryColor = [5, 150, 105]; // Emerald
        this.accentColor = [16, 185, 129];
        break;
      case 'corporate-navy':
        this.primaryColor = [51, 65, 85]; // Slate
        this.accentColor = [71, 85, 105];
        break;
      default:
        this.primaryColor = [37, 99, 235];
        this.accentColor = [59, 130, 246];
    }
  }

  parseResumeContent(resumeText) {
    const lines = resumeText.split('\n').filter(line => line.trim() !== '');
    const sections = [];
    let currentSection = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if it's a section header (all caps or has dashes)
      if (this.isSectionHeader(trimmedLine)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          type: 'section',
          title: this.cleanSectionTitle(trimmedLine),
          content: []
        };
      } else if (currentSection) {
        currentSection.content.push(trimmedLine);
      } else {
        // This is header information (name, contact, etc.)
        sections.push({
          type: 'header',
          content: trimmedLine
        });
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  }

  isSectionHeader(line) {
    const upperLine = line.toUpperCase();
    const commonSections = [
      'PROFESSIONAL SUMMARY', 'SUMMARY', 'OBJECTIVE',
      'EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE',
      'EDUCATION', 'SKILLS', 'TECHNICAL SKILLS',
      'PROJECTS', 'CERTIFICATIONS', 'ACHIEVEMENTS'
    ];
    
    return commonSections.some(section => upperLine.includes(section)) ||
           line.includes('---') ||
           (line === upperLine && line.length > 3 && line.length < 50);
  }

  cleanSectionTitle(title) {
    return title.replace(/[-=]+/g, '').trim().toUpperCase();
  }

  generateContent(pdf, sections, theme) {
    let isFirstSection = true;
    
    for (const section of sections) {
      if (section.type === 'header') {
        this.addHeaderContent(pdf, section.content, isFirstSection);
        isFirstSection = false;
      } else if (section.type === 'section') {
        this.addSection(pdf, section, theme);
      }
    }
  }

  addHeaderContent(pdf, content, isName = false) {
    if (isName) {
      // Name - largest font
      pdf.setTextColor(...this.primaryColor);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
    } else if (content.includes('@') || content.includes('|')) {
      // Contact information
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
    } else {
      // Title/subtitle
      pdf.setTextColor(...this.accentColor);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
    }
    
    // Center align header content
    const textWidth = pdf.getStringUnitWidth(content) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
    const x = (this.pageWidth - textWidth) / 2;
    
    pdf.text(content, x, this.currentY);
    this.currentY += isName ? 8 : 6;
    
    // Add line under header
    if (isName) {
      pdf.setDrawColor(...this.accentColor);
      pdf.setLineWidth(0.5);
      pdf.line(this.pageMargin, this.currentY, this.pageWidth - this.pageMargin, this.currentY);
      this.currentY += 8;
    }
  }

  addSection(pdf, section, theme) {
    // Check if we need a new page
    if (this.currentY > this.pageHeight - 40) {
      pdf.addPage();
      this.currentY = this.pageMargin;
    }
    
    // Section title
    pdf.setTextColor(...this.primaryColor);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(section.title, this.pageMargin, this.currentY);
    this.currentY += 8;
    
    // Section underline
    pdf.setDrawColor(...this.accentColor);
    pdf.setLineWidth(0.3);
    pdf.line(this.pageMargin, this.currentY - 2, this.pageMargin + 40, this.currentY - 2);
    this.currentY += 2;
    
    // Section content
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    for (const line of section.content) {
      if (line.trim() === '') continue;
      
      // Check if we need a new page
      if (this.currentY > this.pageHeight - 20) {
        pdf.addPage();
        this.currentY = this.pageMargin;
      }
      
      // Handle bullet points
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        this.addBulletPoint(pdf, line);
      } else if (this.isJobTitle(line)) {
        this.addJobTitle(pdf, line);
      } else {
        this.addRegularText(pdf, line);
      }
    }
    
    this.currentY += 6; // Space after section
  }

  addBulletPoint(pdf, text) {
    const cleanText = text.replace(/^[•\-*]\s*/, '');
    const lines = pdf.splitTextToSize(cleanText, this.maxWidth - 10);
    
    for (let i = 0; i < lines.length; i++) {
      if (this.currentY > this.pageHeight - 20) {
        pdf.addPage();
        this.currentY = this.pageMargin;
      }
      
      if (i === 0) {
        pdf.text('•', this.pageMargin + 5, this.currentY);
        pdf.text(lines[i], this.pageMargin + 10, this.currentY);
      } else {
        pdf.text(lines[i], this.pageMargin + 10, this.currentY);
      }
      this.currentY += this.lineHeight;
    }
  }

  addJobTitle(pdf, text) {
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...this.primaryColor);
    const lines = pdf.splitTextToSize(text, this.maxWidth);
    
    for (const line of lines) {
      if (this.currentY > this.pageHeight - 20) {
        pdf.addPage();
        this.currentY = this.pageMargin;
      }
      pdf.text(line, this.pageMargin, this.currentY);
      this.currentY += this.lineHeight + 1;
    }
    
    // Reset font for next content
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
  }

  addRegularText(pdf, text) {
    const lines = pdf.splitTextToSize(text, this.maxWidth);
    
    for (const line of lines) {
      if (this.currentY > this.pageHeight - 20) {
        pdf.addPage();
        this.currentY = this.pageMargin;
      }
      pdf.text(line, this.pageMargin, this.currentY);
      this.currentY += this.lineHeight;
    }
  }

  isJobTitle(line) {
    // Simple heuristic: if line contains company indicators or date patterns
    return line.includes('|') || 
           /\d{4}/.test(line) || 
           line.includes('Present') ||
           (line.length < 100 && !line.startsWith('•') && !line.startsWith('-'));
  }
  
  async generateDocx(resumeText, theme, fileName = 'resume.docx') {
  try {
    const doc = new Document({
      sections: [
        {
          children: resumeText
            .split("\n")
            .filter(line => line.trim() !== "")
            .map(line => {
              // Detect headings
              const isHeading =
                line === line.toUpperCase() ||
                ["SUMMARY", "SKILLS", "EXPERIENCE", "EDUCATION", "PROJECTS", "CERTIFICATIONS"].some(
                  section => line.toUpperCase().includes(section)
                );

              if (isHeading) {
                return new Paragraph({
                  text: line,
                  heading: HeadingLevel.HEADING_1,
                });
              }

              // Bullet points
              if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
                return new Paragraph({
                  text: line.replace(/^[•\-*]\s*/, ""),


                  bullet: { level: 0 },
                });
              }

              // Normal paragraph
              return new Paragraph({
                children: [new TextRun(line)],
              });
            }),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
  } catch (error) {
    console.error("DOCX Generation Error:", error);
    throw new Error("Failed to generate DOCX: " + error.message);
  }
}

  

  formatResumeForDocx(resumeText, theme) {
    // Add rich text formatting markers that can be interpreted
    let formatted = resumeText;
    
    // Add theme-specific formatting hints
    formatted = `=== THEME: ${theme.name} ===\n\n` + formatted;
    
    // Format section headers
    formatted = formatted.replace(
      /(PROFESSIONAL SUMMARY|SUMMARY|EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS)/g,
      '\n**$1**\n' + '-'.repeat(20) + '\n'
    );
    
    return formatted;
  }
}

const pdfGeneratorInstance = new PDFGenerator();
export default pdfGeneratorInstance;