import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

config();

console.log('🤖 Gemini AI Service Started...');

/* =========================================================
   GEMINI INSTANCE
========================================================= */

const getGeminiInstance = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY missing');
    return null;
  }

  return new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );
};

/* =========================================================
   JOB KEYWORDS
========================================================= */

const jobKeywords = {

  'Full Stack Developer': [
    'javascript',
    'react',
    'node.js',
    'mongodb',
    'express',
    'api',
    'html',
    'css',
    'git',
    'sql',
    'deployment',
    'cloud'
  ],

  'Frontend Developer': [
    'html',
    'css',
    'javascript',
    'react',
    'tailwind',
    'responsive',
    'typescript',
    'redux'
  ],

  'Backend Developer': [
    'node.js',
    'express',
    'mongodb',
    'sql',
    'api',
    'authentication',
    'jwt',
    'security'
  ],

  'Software Engineer': [
    'java',
    'python',
    'javascript',
    'react',
    'git',
    'database',
    'algorithms',
    'testing'
  ],

  'General': [
    'communication',
    'teamwork',
    'leadership',
    'problem solving'
  ]
};

/* =========================================================
   RESUME VALIDATION
========================================================= */

const isResume = (text) => {

  const resumeSections = [
    'education',
    'experience',
    'skills',
    'projects',
    'internship',
    'certifications',
    'summary',
    'objective'
  ];

  let matches = 0;

  resumeSections.forEach(section => {

    if (
      text.toLowerCase().includes(section)
    ) {
      matches++;
    }

  });

  return matches >= 3;
};

/* =========================================================
   MAIN ANALYZE FUNCTION
========================================================= */

export const analyzeResume = async (
  resumeText,
  targetRole = 'General'
) => {

  try {

    if (!isResume(resumeText)) {

      return {
        atsScore: 0,
        jobMatchScore: 0,

        suggestions: [
          {
            title: 'Invalid Resume',

            description:
              'Uploaded file does not appear to be a valid resume.'
          }
        ]
      };
    }

    const atsScore = calculateATSScore(
      resumeText,
      targetRole
    );

    const jobMatchScore =
      calculateJobMatchScore(
        resumeText,
        targetRole
      );

    const suggestions =
      await generateAISuggestions(
        resumeText,
        targetRole,
        atsScore
      );

    return {
      atsScore,
      jobMatchScore,
      suggestions
    };

  } catch (error) {

    console.log(
      '❌ analyzeResume Error:',
      error.message
    );

    return {
      atsScore: 0,
      jobMatchScore: 0,

      suggestions: [
        {
          title: 'Analysis Failed',

          description:
            'Unable to analyze the uploaded resume.'
        }
      ]
    };
  }
};

/* =========================================================
   ATS SCORE
========================================================= */

const calculateATSScore = (
  text,
  targetRole
) => {

  const lowerText =
    text.toLowerCase();

  let score = 0;

  if (lowerText.includes('education'))
    score += 10;

  if (lowerText.includes('skills'))
    score += 10;

  if (lowerText.includes('experience'))
    score += 10;

  if (lowerText.includes('projects'))
    score += 10;

  if (lowerText.includes('@'))
    score += 10;

  if (text.length > 1000)
    score += 10;

  const keywords =
    jobKeywords[targetRole] || [];

  let matches = 0;

  keywords.forEach(keyword => {

    if (
      lowerText.includes(
        keyword.toLowerCase()
      )
    ) {
      matches++;
    }

  });

  let keywordScore = 0;

  if (keywords.length > 0) {

    keywordScore =
      Math.round(
        (matches / keywords.length) * 40
      );
  }

  score += keywordScore;

  return Math.min(score, 100);
};

/* =========================================================
   JOB MATCH SCORE
========================================================= */

const calculateJobMatchScore = (
  text,
  targetRole
) => {

  if (targetRole === 'General') {
    return 50;
  }

  const keywords =
    jobKeywords[targetRole] || [];

  const lowerText =
    text.toLowerCase();

  if (keywords.length === 0) {
    return 0;
  }

  let matches = 0;

  keywords.forEach(keyword => {

    if (
      lowerText.includes(
        keyword.toLowerCase()
      )
    ) {
      matches++;
    }

  });

  return Math.min(
    Math.round(
      (matches / keywords.length) * 100
    ),
    100
  );
};

/* =========================================================
   GEMINI AI SUGGESTIONS
========================================================= */

const generateAISuggestions = async (
  resumeText,
  targetRole,
  currentScore
) => {

  try {

    const genAI =
      getGeminiInstance();

    if (!genAI) {

      return [
        {
          title: 'Gemini API Missing',

          description:
            'GEMINI_API_KEY not found in .env'
        }
      ];
    }

    console.log(
      '📤 Sending request to Gemini...'
    );

    const model =
      genAI.getGenerativeModel({
        model: 'gemini-2.5-flash'
      });

    const prompt = `
You are an ATS Resume Analyzer.

Analyze this resume carefully.

Target Role:
${targetRole}

Current ATS Score:
${currentScore}/100

Resume:
${resumeText.substring(0, 3000)}

Instructions:
- Give ONLY resume-specific suggestions
- Do NOT give generic suggestions
- Mention missing skills
- Mention weak projects
- Mention formatting issues
- Mention ATS keyword improvements

Return ONLY valid JSON.

Format:

[
  {
    "title": "Suggestion title",
    "description": "Detailed explanation"
  }
]
`;

    const result =
      await model.generateContent(
        prompt
      );

    const response =
      await result.response;

    const text =
      response.text();

    console.log(
      '✅ Gemini Raw Response:'
    );

    console.log(text);

    const cleaned =
      text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    const suggestions =
      JSON.parse(cleaned);

    return suggestions;

  } catch (error) {

    console.log(
      '❌ Gemini Error:',
      error.message
    );

    return [
      {
        title: 'Gemini Error',

        description:
          'Failed to generate AI suggestions.'
      }
    ];
  }
};

/* =========================================================
   GEMINI TEST
========================================================= */

export const testGeminiConnection =
  async () => {

    try {

      const genAI =
        getGeminiInstance();

      if (!genAI) {

        console.log(
          '❌ No Gemini API Key'
        );

        return false;
      }

      const model =
        genAI.getGenerativeModel({
          model: 'gemini-2.5-flash'
        });

      const result =
        await model.generateContent(
          'Say only: Gemini API working'
        );

      const response =
        await result.response;

      console.log(
        response.text()
      );

      return true;

    } catch (error) {

      console.log(
        '❌ Gemini Test Failed:',
        error.message
      );

      return false;
    }
};