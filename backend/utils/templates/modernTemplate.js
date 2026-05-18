import {
  PAGE_LAYOUT,
  TYPOGRAPHY,
  COLORS,
  SPACING,
  renderSectionTitle,
  renderBodyText,
  renderBulletList,
  renderContactInfo,
  renderSection,
  wouldExceedPage,
  addNewPage,
  cleanContent,
  formatExperienceItem,
  formatEducationItem,
} from './pdfHelpers.js';

/* ========================================================================
   MODERN TEMPLATE - Clean, professional, ATS-friendly resume design
======================================================================== */

const CONTENT_WIDTH = PAGE_LAYOUT.width - PAGE_LAYOUT.margin * 2;

/**
 * Render header with name and contact info
 */
const renderHeader = (doc, content) => {
  const headerY = PAGE_LAYOUT.margin;
  const headerBgHeight = SPACING.headerHeight + SPACING.headerToContent;

  // Header background
  doc
    .rect(0, 0, PAGE_LAYOUT.width, headerBgHeight)
    .fill(COLORS.primary);

  // Name
  doc
    .font("Helvetica-Bold")
    .fontSize(TYPOGRAPHY.headerName.size)
    .fillColor("white")
    .text(content.name || "YOUR NAME", PAGE_LAYOUT.margin, headerY + 15, {
      width: CONTENT_WIDTH,
    });

  // Contact info
  const contactY = headerY + 50;
  doc
    .font("Helvetica")
    .fontSize(TYPOGRAPHY.headerSub.size)
    .fillColor("#E8F1FF");

  const contactInfo = [content.email, content.phone]
    .filter(Boolean)
    .join(" | ");
  if (contactInfo) {
    doc.text(contactInfo, PAGE_LAYOUT.margin, contactY, {
      width: CONTENT_WIDTH,
    });
  }

  return PAGE_LAYOUT.margin + headerBgHeight + SPACING.headerToContent;
};

/**
 * Render skills section with comma-separated formatting
 */
const renderSkillsSection = (doc, skills, x, y) => {
  if (!skills || skills.length === 0) return y;

  let currentY = renderSectionTitle(doc, "SKILLS", x, y, CONTENT_WIDTH);

  const skillsArray = Array.isArray(skills) ? skills : [skills];
  const cleanedSkills = cleanContent(skillsArray);

  if (cleanedSkills.length > 0) {
    const skillsText = cleanedSkills.join(" • ");
    currentY = renderBodyText(doc, skillsText, x, currentY, CONTENT_WIDTH);
  }

  return currentY;
};

/**
 * Render experience section with proper formatting
 */
const renderExperienceSection = (doc, experience, x, y, onPageBreak) => {
  if (!experience || experience.length === 0) return y;

  let currentY = y;

  // Check if title fits
  if (wouldExceedPage(currentY, 30)) {
    currentY = addNewPage(doc, onPageBreak);
  }

  currentY = renderSectionTitle(doc, "EXPERIENCE", x, currentY, CONTENT_WIDTH);

  const experiences = Array.isArray(experience) ? experience : [experience];
  const cleanedExp = cleanContent(experiences);

  for (const exp of cleanedExp) {
    const expText = formatExperienceItem(exp);
    if (!expText.trim()) continue;

    const estimatedHeight = doc.heightOfString(expText, {
      width: CONTENT_WIDTH,
      lineGap: SPACING.lineHeight,
    }) + SPACING.itemGap;

    if (wouldExceedPage(currentY, estimatedHeight + 20)) {
      currentY = addNewPage(doc, onPageBreak);
    }

    doc
      .font("Helvetica")
      .fontSize(TYPOGRAPHY.sectionBody.size)
      .fillColor(COLORS.text)
      .text(expText, x, currentY, {
        width: CONTENT_WIDTH,
        lineGap: SPACING.lineHeight,
      });

    currentY = doc.y + SPACING.itemGap;
  }

  return currentY + SPACING.sectionGap;
};

/**
 * Render education section
 */
const renderEducationSection = (doc, education, x, y, onPageBreak) => {
  if (!education || education.length === 0) return y;

  let currentY = y;

  // Check if title fits
  if (wouldExceedPage(currentY, 30)) {
    currentY = addNewPage(doc, onPageBreak);
  }

  currentY = renderSectionTitle(
    doc,
    "EDUCATION",
    x,
    currentY,
    CONTENT_WIDTH
  );

  const educationArray = Array.isArray(education) ? education : [education];
  const cleanedEdu = cleanContent(educationArray);

  for (const edu of cleanedEdu) {
    const eduText = formatEducationItem(edu);
    if (!eduText.trim()) continue;

    const estimatedHeight = doc.heightOfString(eduText, {
      width: CONTENT_WIDTH,
      lineGap: SPACING.lineHeight,
    }) + SPACING.itemGap;

    if (wouldExceedPage(currentY, estimatedHeight + 20)) {
      currentY = addNewPage(doc, onPageBreak);
    }

    doc
      .font("Helvetica")
      .fontSize(TYPOGRAPHY.sectionBody.size)
      .fillColor(COLORS.text)
      .text(eduText, x, currentY, {
        width: CONTENT_WIDTH,
        lineGap: SPACING.lineHeight,
      });

    currentY = doc.y + SPACING.itemGap;
  }

  return currentY + SPACING.sectionGap;
};

/**
 * Render projects section
 */
const renderProjectsSection = (doc, projects, x, y, onPageBreak) => {
  if (!projects || projects.length === 0) return y;

  let currentY = y;

  // Check if title fits
  if (wouldExceedPage(currentY, 30)) {
    currentY = addNewPage(doc, onPageBreak);
  }

  currentY = renderSectionTitle(doc, "PROJECTS", x, currentY, CONTENT_WIDTH);

  const projectsArray = Array.isArray(projects) ? projects : [projects];
  const cleanedProjects = cleanContent(projectsArray);

  for (const project of cleanedProjects) {
    const projText = String(project).trim();
    if (!projText) continue;

    const estimatedHeight = doc.heightOfString(projText, {
      width: CONTENT_WIDTH,
      lineGap: SPACING.lineHeight,
    }) + SPACING.itemGap;

    if (wouldExceedPage(currentY, estimatedHeight + 20)) {
      currentY = addNewPage(doc, onPageBreak);
    }

    doc
      .font("Helvetica")
      .fontSize(TYPOGRAPHY.sectionBody.size)
      .fillColor(COLORS.text)
      .text(projText, x, currentY, {
        width: CONTENT_WIDTH,
        lineGap: SPACING.lineHeight,
      });

    currentY = doc.y + SPACING.itemGap;
  }

  return currentY + SPACING.sectionGap;
};

/**
 * Render summary section
 */
const renderSummarySection = (doc, summary, x, y, onPageBreak) => {
  if (!summary || String(summary).trim() === "") return y;

  let currentY = y;

  // Check if title fits
  if (wouldExceedPage(currentY, 30)) {
    currentY = addNewPage(doc, onPageBreak);
  }

  currentY = renderSectionTitle(doc, "SUMMARY", x, currentY, CONTENT_WIDTH);
  currentY = renderBodyText(
    doc,
    String(summary).trim(),
    x,
    currentY,
    CONTENT_WIDTH
  );

  return currentY;
};

/**
 * Main template renderer
 */
export const generateModernTemplate = (doc, content) => {
  const x = PAGE_LAYOUT.margin;
  let y = renderHeader(doc, content);

  // Define page break callback for header
  const onPageBreak = () => {
    y = PAGE_LAYOUT.margin;
  };

  // Render sections in order
  y = renderSummarySection(doc, content.summary, x, y, onPageBreak);
  y = renderSkillsSection(doc, content.skills, x, y);
  y = renderExperienceSection(doc, content.experience, x, y, onPageBreak);
  y = renderEducationSection(doc, content.education, x, y, onPageBreak);
  y = renderProjectsSection(doc, content.projects, x, y, onPageBreak);
};
