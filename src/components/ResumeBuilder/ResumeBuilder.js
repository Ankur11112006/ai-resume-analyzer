import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Code, Award, Plus, Trash2, Download, Sparkles } from 'lucide-react';
import GeminiService from '../../services/geminiService';
import ThemeSelector from '../ThemeSelector/ThemeSelector';


const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
    skills: [],
    education: [{ degree: '', institute: '', startDate: '', endDate: '', gpa: '' }],
    experience: [{ role: '', company: '', startDate: '', endDate: '', bullets: [''] }],
    projects: [{ title: '', description: '', techStack: '', link: '' }],
    certifications: [{ name: '', issuer: '', date: '' }]
  });

  const [generatedResume, setGeneratedResume] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const updateFormData = (section, index, field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (typeof index === 'number') {
        newData[section][index][field] = value;
      } else {
        newData[section] = value;
      }
      return newData;
    });
  };

  const addItem = (section) => {
    setFormData(prev => {
      const newData = { ...prev };
      switch (section) {
        case 'x':
          
         break;
         default:
          break;
          
        case 'education':
          newData.education.push({ degree: '', institute: '', startDate: '', endDate: '', gpa: '' });
          break;
        case 'experience':
          newData.experience.push({ role: '', company: '', startDate: '', endDate: '', bullets: [''] });
          break;
        case 'projects':
          newData.projects.push({ title: '', description: '', techStack: '', link: '' });
          break;
        case 'certifications':
          newData.certifications.push({ name: '', issuer: '', date: '' });
          break;
      }
      return newData;
    });
  };

  const removeItem = (section, index) => {
    setFormData(prev => {
      const newData = { ...prev };
      newData[section].splice(index, 1);
      return newData;
    });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addBulletPoint = (expIndex) => {
    setFormData(prev => {
      const newData = { ...prev };
      newData.experience[expIndex].bullets.push('');
      return newData;
    });
  };

  const removeBulletPoint = (expIndex, bulletIndex) => {
    setFormData(prev => {
      const newData = { ...prev };
      newData.experience[expIndex].bullets.splice(bulletIndex, 1);
      return newData;
    });
  };

  const generateResume = async () => {
    setIsGenerating(true);
    try {
      const resume = await GeminiService.generateResumeFromData(formData);
      setGeneratedResume(resume);
    } catch (error) {
      console.error('Resume generation error:', error);
      // Fallback to template-based generation
      setGeneratedResume(generateTemplateResume());
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTemplateResume = () => {
    let resume = `${formData.name}\n`;
    resume += `${formData.title}\n`;
    resume += `${formData.email} | ${formData.phone} | ${formData.location}\n`;
    
    if (formData.linkedin) resume += `LinkedIn: ${formData.linkedin}\n`;
    if (formData.github) resume += `GitHub: ${formData.github}\n`;
    if (formData.portfolio) resume += `Portfolio: ${formData.portfolio}\n`;
    
    if (formData.summary) {
      resume += `\nPROFESSIONAL SUMMARY\n`;
      resume += `${formData.summary}\n`;
    }
    
    if (formData.skills.length) {
      resume += `\nTECHNICAL SKILLS\n`;
      resume += `${formData.skills.join(', ')}\n`;
    }
    
    if (formData.experience.some(exp => exp.role)) {
      resume += `\nPROFESSIONAL EXPERIENCE\n`;
      formData.experience.forEach(exp => {
        if (exp.role) {
          resume += `\n${exp.role} | ${exp.company}\n`;
          resume += `${exp.startDate} - ${exp.endDate}\n`;
          exp.bullets.forEach(bullet => {
            if (bullet.trim()) resume += `â€¢ ${bullet}\n`;
          });
        }
      });
    }
    
    return resume;
  };

  const handleThemeDownload = (theme, format) => {
    const blob = new Blob([generatedResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${theme.name.toLowerCase().replace(/\s+/g, '_')}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowThemeSelector(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Resume Builder</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Create a professional, ATS-optimized resume with AI assistance. 
          Fill out the form below and let our AI generate a polished resume for you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => updateFormData('name', null, null, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Professional Title *"
                value={formData.title}
                onChange={(e) => updateFormData('title', null, null, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={(e) => updateFormData('email', null, null, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', null, null, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Location (City, State)"
                value={formData.location}
                onChange={(e) => updateFormData('location', null, null, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="LinkedIn Profile"
                value={formData.linkedin}
                onChange={(e) => updateFormData('linkedin', null, null, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="GitHub Profile"
                value={formData.github}
                onChange={(e) => updateFormData('github', null, null, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="Portfolio Website"
                value={formData.portfolio}
                onChange={(e) => updateFormData('portfolio', null, null, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="mt-4">
              <textarea
                placeholder="Professional Summary (optional)"
                value={formData.summary}
                onChange={(e) => updateFormData('summary', null, null, e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <Code className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
            </div>
            
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={addSkill}
                className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Professional Experience</h3>
              </div>
              <button
                onClick={() => addItem('experience')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Experience</span>
              </button>
            </div>
            
            {formData.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.role}
                    onChange={(e) => updateFormData('experience', index, 'role', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => updateFormData('experience', index, 'company', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Start Date (e.g., Jan 2023)"
                    value={exp.startDate}
                    onChange={(e) => updateFormData('experience', index, 'startDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="End Date (e.g., Present)"
                    value={exp.endDate}
                    onChange={(e) => updateFormData('experience', index, 'endDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Key Achievements & Responsibilities:</label>
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="â€¢ Describe your achievement or responsibility..."
                        value={bullet}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index].bullets[bulletIndex] = e.target.value;
                          setFormData(prev => ({ ...prev, experience: newExp }));
                        }}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeBulletPoint(index, bulletIndex)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addBulletPoint(index)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Achievement</span>
                  </button>
                </div>
                
                {formData.experience.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => removeItem('experience', index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove Experience</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-6 w-6 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-900">Education</h3>
              </div>
              <button
                onClick={() => addItem('education')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Education</span>
              </button>
            </div>
            
            {formData.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Degree (e.g., Bachelor of Computer Science)"
                    value={edu.degree}
                    onChange={(e) => updateFormData('education', index, 'degree', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Institution Name"
                    value={edu.institute}
                    onChange={(e) => updateFormData('education', index, 'institute', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Start Date (e.g., 2020)"
                    value={edu.startDate}
                    onChange={(e) => updateFormData('education', index, 'startDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="End Date (e.g., 2024)"
                    value={edu.endDate}
                    onChange={(e) => updateFormData('education', index, 'endDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="GPA (optional)"
                    value={edu.gpa}
                    onChange={(e) => updateFormData('education', index, 'gpa', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                {formData.education.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => removeItem('education', index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove Education</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Code className="h-6 w-6 text-cyan-600" />
                <h3 className="text-xl font-semibold text-gray-900">Projects</h3>
              </div>
              <button
                onClick={() => addItem('projects')}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </button>
            </div>
            
            {formData.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={project.title}
                    onChange={(e) => updateFormData('projects', index, 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    placeholder="Project Link (optional)"
                    value={project.link}
                    onChange={(e) => updateFormData('projects', index, 'link', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <textarea
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) => updateFormData('projects', index, 'description', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none mb-4"
                />
                <input
                  type="text"
                  placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                  value={project.techStack}
                  onChange={(e) => updateFormData('projects', index, 'techStack', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                
                {formData.projects.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => removeItem('projects', index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove Project</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Certifications Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-yellow-600" />
                <h3 className="text-xl font-semibold text-gray-900">Certifications</h3>
              </div>
              <button
                onClick={() => addItem('certifications')}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Certification</span>
              </button>
            </div>
            
            {formData.certifications.map((cert, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Certification Name"
                    value={cert.name}
                    onChange={(e) => updateFormData('certifications', index, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Organization"
                    value={cert.issuer}
                    onChange={(e) => updateFormData('certifications', index, 'issuer', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Date Obtained"
                    value={cert.date}
                    onChange={(e) => updateFormData('certifications', index, 'date', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                
                {formData.certifications.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => removeItem('certifications', index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove Certification</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Generate Resume Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Generate Your Resume</h4>
            <p className="text-gray-600 mb-6 text-sm">
              Our AI will analyze your information and create a professional, ATS-optimized resume with strong action verbs and proper formatting.
            </p>
            
            <button
              onClick={generateResume}
              disabled={isGenerating || !formData.name || !formData.email}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-3"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>AI is generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate AI Resume</span>
                </>
              )}
            </button>
            
            {(!formData.name || !formData.email) && (
              <p className="text-xs text-gray-500 mt-2">
                * Name and email are required to generate resume
              </p>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Completion Progress</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${formData.name ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`text-sm ${formData.name ? 'text-green-600' : 'text-gray-500'}`}>Personal Info</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${formData.skills.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`text-sm ${formData.skills.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>Skills</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${formData.experience.some(exp => exp.role) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`text-sm ${formData.experience.some(exp => exp.role) ? 'text-green-600' : 'text-gray-500'}`}>Experience</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${formData.education.some(edu => edu.degree) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`text-sm ${formData.education.some(edu => edu.degree) ? 'text-green-600' : 'text-gray-500'}`}>Education</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Resume Preview */}
      {generatedResume && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-semibold text-gray-900">AI-Generated Resume Preview</h4>
            <button
              onClick={() => setShowThemeSelector(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Resume</span>
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
              {generatedResume}
            </pre>
          </div>
        </div>
      )}

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <ThemeSelector
          onClose={() => setShowThemeSelector(false)}
          onDownload={handleThemeDownload}
          resumeText={generatedResume}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;