import OpenAI from 'openai';
import { config } from 'dotenv';

config();

// Function to get OpenAI instance
const getOpenAIInstance = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

// ATS scoring keywords for different job roles
const jobKeywords = {
  'Software Engineer': [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'git', 'agile',
    'api', 'database', 'testing', 'debugging', 'algorithms', 'data structures'
  ],
  'Data Scientist': [
    'python', 'machine learning', 'statistics', 'pandas', 'numpy', 'sql',
    'tensorflow', 'scikit-learn', 'data analysis', 'visualization', 'r', 'jupyter'
  ],
  'Product Manager': [
    'product strategy', 'roadmap', 'user research', 'agile', 'scrum', 'analytics',
    'stakeholder management', 'requirements gathering', 'market analysis', 'kpi'
  ],
  'UX Designer': [
    'user research', 'wireframing', 'prototyping', 'figma', 'sketch', 'usability testing',
    'user-centered design', 'interaction design', 'visual design', 'accessibility'
  ],
  'Marketing Manager': [
    'digital marketing', 'seo', 'content marketing', 'social media', 'analytics',
    'campaign management', 'brand strategy', 'market research', 'crm', 'google analytics'
  ],
  'Business Analyst': [
    'requirements analysis', 'data analysis', 'sql', 'excel', 'tableau', 'process modeling',
    'stakeholder management', 'agile', 'user stories', 'business process'
  ],
  'DevOps Engineer': [
    'docker', 'kubernetes', 'aws', 'azure', 'ci/cd', 'jenkins', 'terraform',
    'linux', 'monitoring', 'automation', 'cloud', 'infrastructure'
  ],
  'Frontend Developer': [
    'html', 'css', 'javascript', 'react', 'vue', 'angular', 'responsive design',
    'sass', 'webpack', 'typescript', 'accessibility', 'performance'
  ],
  'Backend Developer': [
    'node.js', 'python', 'java', 'php', 'sql', 'mongodb', 'api', 'rest',
    'microservices', 'authentication', 'security', 'scalability'
  ],
  'Full Stack Developer': [
    'javascript', 'react', 'node.js', 'python', 'sql', 'html', 'css', 'api',
    'database', 'git', 'testing', 'deployment', 'cloud'
  ],
  'Project Manager': [
    'project planning', 'risk management', 'stakeholder communication', 'agile',
    'scrum', 'budgeting', 'timeline management', 'team leadership', 'reporting'
  ],
  'HR Manager': [
    'recruitment', 'employee relations', 'performance management', 'training',
    'compliance', 'talent acquisition', 'hr policies', 'employee engagement'
  ],
  'Financial Analyst': [
    'financial modeling', 'excel', 'financial statements', 'valuation', 'forecasting',
    'risk analysis', 'budgeting', 'variance analysis', 'kpi', 'reporting'
  ]
};

export const analyzeResume = async (resumeText, targetRole = 'General') => {
  try {
    // Calculate ATS score based on keywords
    const atsScore = calculateATSScore(resumeText, targetRole);

    // Calculate job match score
    const jobMatchScore = calculateJobMatchScore(resumeText, targetRole);

    // Generate AI suggestions
    const suggestions = await generateAISuggestions(resumeText, targetRole, atsScore);

    return {
      atsScore,
      jobMatchScore,
      suggestions
    };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    // Return default values if AI fails
    return {
      atsScore: 50,
      jobMatchScore: 40,
      suggestions: [
        {
          title: 'Resume Analysis Error',
          description: 'Unable to analyze resume. Please ensure the resume text is readable and try again.'
        }
      ]
    };
  }
};

const calculateATSScore = (text, targetRole) => {
  const lowerText = text.toLowerCase();
  let score = 0;
  let maxScore = 100;

  // Basic formatting checks
  if (text.includes('\n')) score += 10; // Has line breaks
  if (text.length > 500) score += 10; // Sufficient length
  if (lowerText.includes('experience') || lowerText.includes('skills')) score += 10;

  // Keyword matching
  const keywords = jobKeywords[targetRole] || [];
  let keywordMatches = 0;

  keywords.forEach(keyword => {
    if (lowerText.includes(keyword.toLowerCase())) {
      keywordMatches++;
    }
  });

  const keywordScore = Math.min((keywordMatches / keywords.length) * 50, 50);
  score += keywordScore;

  // Contact information check
  if (lowerText.includes('@') || lowerText.includes('phone') || lowerText.includes('email')) {
    score += 10;
  }

  return Math.min(Math.round(score), 100);
};

const calculateJobMatchScore = (text, targetRole) => {
  if (targetRole === 'General') return 50;

  const keywords = jobKeywords[targetRole] || [];
  const lowerText = text.toLowerCase();
  let matches = 0;

  keywords.forEach(keyword => {
    if (lowerText.includes(keyword.toLowerCase())) {
      matches++;
    }
  });

  return Math.min(Math.round((matches / keywords.length) * 100), 100);
};

const generateAISuggestions = async (resumeText, targetRole, currentScore) => {
  try {
    // If OpenAI is not configured, return default suggestions
    const openai = getOpenAIInstance();
    if (!openai) {
      console.warn('⚠️  OpenAI API key not configured. Using default suggestions.');
      return getDefaultSuggestions(currentScore, targetRole);
    }

    const prompt = `
Analyze this resume for a ${targetRole} position. Current ATS score: ${currentScore}/100.

Resume text:
${resumeText.substring(0, 2000)}

Provide 3-5 specific, actionable suggestions to improve this resume for ATS systems and the target role. Focus on:
1. Keyword optimization
2. Formatting improvements
3. Content enhancements
4. ATS compatibility

Format each suggestion as a title and description.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume consultant specializing in ATS optimization. Provide concise, actionable advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Parse AI response into structured suggestions
    const suggestions = parseAISuggestions(aiResponse);

    return suggestions.length > 0 ? suggestions : getDefaultSuggestions(currentScore, targetRole);
  } catch (error) {
    console.error('AI Suggestions Error:', error);
    return getDefaultSuggestions(currentScore, targetRole);
  }
};

const parseAISuggestions = (aiResponse) => {
  const suggestions = [];
  const lines = aiResponse.split('\n').filter(line => line.trim());

  let currentSuggestion = null;

  lines.forEach(line => {
    if (line.match(/^\d+\.?\s/) || line.match(/^[A-Z][^:]*:/)) {
      if (currentSuggestion) {
        suggestions.push(currentSuggestion);
      }
      const title = line.replace(/^\d+\.?\s*/, '').replace(/:$/, '').trim();
      currentSuggestion = { title, description: '' };
    } else if (currentSuggestion && line.trim()) {
      currentSuggestion.description += line.trim() + ' ';
    }
  });

  if (currentSuggestion) {
    suggestions.push(currentSuggestion);
  }

  return suggestions.slice(0, 5); // Limit to 5 suggestions
};

const getDefaultSuggestions = (score, targetRole) => {
  const suggestions = [
    {
      title: 'Add Relevant Keywords',
      description: `Include more keywords related to ${targetRole} such as technical skills, tools, and industry terms.`
    },
    {
      title: 'Improve Formatting',
      description: 'Use standard fonts, clear headings, and consistent formatting. Avoid tables, images, and complex layouts.'
    },
    {
      title: 'Quantify Achievements',
      description: 'Add specific numbers and metrics to demonstrate your impact (e.g., "Increased sales by 25%").'
    },
    {
      title: 'Optimize File Format',
      description: 'Save your resume as a .docx or .pdf file. Ensure the file name includes relevant keywords.'
    }
  ];

return suggestions.slice(0, Math.max(2, 5 - Math.floor(score / 20)));
};