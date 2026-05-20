export const parseResume = (text = "") => {
  const cleanText = text
    .replace(/\r/g, "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .trim();

  const cleanLine = (line) =>
    line
      .replace(/^[\s\-\*•]+/, "")
      .trim();

  const splitAndClean = (value) =>
    value
      .split("\n")
      .map(cleanLine)
      .filter(Boolean);

  const lines = cleanText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const content = {
    name: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: [],
    education: [],
    projects: [],
    experience: [],
    certifications: [],
    achievements: []
  };

  content.name = lines[0] || "YOUR NAME";

  const emailMatch = cleanText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (emailMatch) {
    content.email = emailMatch[0];
  }

  const phoneMatch = cleanText.match(/(\+\d{1,3}[-\s]?)?[0-9]{7,14}/);
  if (phoneMatch) {
    content.phone = phoneMatch[0];
  }

  const linkedinMatch = cleanText.match(/linkedin\.com\/[^\n\s]+/i);
  if (linkedinMatch) {
    content.linkedin = linkedinMatch[0];
  }

  const githubMatch = cleanText.match(/github\.com\/[^\n\s]+/i);
  if (githubMatch) {
    content.github = githubMatch[0];
  }

  const extractSection = (sectionNames, nextSections) => {
    const sectionPattern = sectionNames
      .map((name) => name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"))
      .join("|");
    const nextPattern = nextSections
      .map((name) => name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"))
      .join("|");
    const regex = new RegExp(`(?:${sectionPattern})\\s*([\\s\\S]*?)(?=${nextPattern}|$)`, "i");
    const match = cleanText.match(regex);
    return match ? match[1].trim() : "";
  };

  content.summary = splitAndClean(
    extractSection(
      ["SUMMARY", "PROFESSIONAL SUMMARY", "CAREER SUMMARY", "PROFILE"],
      ["TECHNICAL SKILLS", "SKILLS", "EDUCATION", "EXPERIENCE", "PROJECTS", "ACHIEVEMENTS", "CERTIFICATIONS"]
    )
  )
    .join(" ")
    .trim();

  const skillsText =
    extractSection(
      ["TECHNICAL SKILLS", "SKILLS", "TOOLS"],
      ["EDUCATION", "CERTIFICATIONS", "PROJECTS", "EXPERIENCE", "ACHIEVEMENTS"]
    ) ||
    extractSection(
      ["SKILLS"],
      ["EDUCATION", "CERTIFICATIONS", "PROJECTS", "EXPERIENCE", "ACHIEVEMENTS"]
    );
  content.skills = splitAndClean(skillsText);

  content.education = splitAndClean(
    extractSection(
      ["EDUCATION", "ACADEMIC BACKGROUND", "ACADEMIC EXPERIENCE"],
      ["CERTIFICATIONS", "PROJECTS", "EXPERIENCE", "ACHIEVEMENTS", "LANGUAGES"]
    )
  );

  content.projects = splitAndClean(
    extractSection(
      ["PROJECTS", "SELECTED PROJECTS", "RELEVANT PROJECTS"],
      ["EXPERIENCE", "CERTIFICATIONS", "LANGUAGES", "ACHIEVEMENTS"]
    )
  );

  content.experience = splitAndClean(
    extractSection(
      ["EXPERIENCE", "WORK EXPERIENCE", "PROFESSIONAL EXPERIENCE", "EMPLOYMENT HISTORY"],
      ["CERTIFICATIONS", "LANGUAGES", "PROJECTS", "ACHIEVEMENTS"]
    )
  );

  content.certifications = splitAndClean(
    extractSection(
      ["CERTIFICATIONS", "COURSEWORK", "TRAINING"],
      ["PROJECTS", "LANGUAGES", "EXPERIENCE", "ACHIEVEMENTS"]
    )
  );

  content.achievements = splitAndClean(
    extractSection(
      ["ACHIEVEMENTS", "AWARDS", "HONORS", "RECOGNITION"],
      ["PROJECTS", "EXPERIENCE", "CERTIFICATIONS", "LANGUAGES"]
    )
  );

  return content;
};