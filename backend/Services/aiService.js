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
      const improvedResume =
  await generateImprovedResume(
    resumeText,
    targetRole
  );
    return {
      atsScore,
      jobMatchScore,
      suggestions,
      improvedResume
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

  const lowerText =
    text.toLowerCase();

  // GENERAL ANALYSIS
  if (
    !targetRole ||
    targetRole === 'General'
  ) {

    let generalScore = 0;

    if (lowerText.includes('skills'))
      generalScore += 20;

    if (lowerText.includes('projects'))
      generalScore += 20;

    if (lowerText.includes('education'))
      generalScore += 20;

    if (lowerText.includes('experience'))
      generalScore += 20;

    if (text.length > 800)
      generalScore += 20;

    return generalScore;
  }

  // ROLE-BASED ANALYSIS

  const keywords =
    jobKeywords[targetRole] || [];

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
          title: "Gemini API Missing",
          description:
            "Gemini API key not found."
        }
      ];
    }

    console.log(
      "📤 Sending request to Gemini..."
    );

    // ONLY WORKING MODEL
    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
      });

    const prompt = `
You are an advanced ATS Resume Analyzer.

Analyze the resume professionally.

Target Role:
${targetRole}

Current ATS Score:
${currentScore}/100

Resume Content:
${resumeText.substring(0, 3500)}

Instructions:

- Give professional ATS feedback
- Mention formatting improvements
- Mention missing technical skills
- Mention ATS keyword improvements
- Mention project improvements
- Mention grammar issues if present
- Keep suggestions concise
- Avoid generic suggestions

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
      "✅ Gemini Suggestions Generated"
    );

    const cleaned =
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleaned);

  } catch (error) {

    console.log(
      "❌ Gemini Suggestions Error:",
      error.message
    );

    // HIGH DEMAND / TEMPORARY ERROR
    if (
      error.message.includes("503") ||
      error.message.includes("high demand")
    ) {

      return [
        {
          title: "Gemini Busy",
          description:
            "Gemini AI is currently under heavy load. Please try again in a few seconds."
        }
      ];
    }

    return [
      {
        title: "AI Analysis Failed",
        description:
          "Unable to generate AI suggestions right now."
      }
    ];
  }
};
/* =========================================================
   GENERATE IMPROVED RESUME
========================================================= */
const generateImprovedResume = async (
  resumeText,
  targetRole
) => {

  try {

    const genAI =
      getGeminiInstance();

    if (!genAI) {
      return "";
    }

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
      });

    const prompt = `
You are a professional ATS resume writer.

Rewrite and improve this resume professionally.

STRICT RULES:
- Preserve the exact facts from the original resume.
- Keep original project titles and project descriptions in the PROJECTS section.
- If a project needs improvement, add suggestions only inside PROJECTS.
- Do not move project content into SKILLS, EXPERIENCE, EDUCATION, or any other section.
- Use strong action verbs and ATS-friendly wording.
- Keep the resume truthful; do not invent any new experience.
- Do not include any scores, metadata, or analysis in the output.
- Return plain text only, without markdown formatting, code fences, or JSON.

Use the following exact section headings in uppercase, each on its own line:
SUMMARY
SKILLS
EXPERIENCE
EDUCATION
PROJECTS
CERTIFICATIONS

Target Role:
${targetRole}

Resume:
${resumeText}

Return ONLY the improved resume with the exact headings above.
`;

    const result =
      await model.generateContent(
        prompt
      );

    const response =
      await result.response;

    const improved =
      response.text();

    const cleaned = improved
      .replace(/```(?:[a-z]*)?/gi, "")
      .trim();

    console.log(
      "✅ Improved Resume Generated"
    );

    return cleaned;

  } catch (error) {

    console.log(
      "❌ Improved Resume Error:",
      error.message
    );

    return "";
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