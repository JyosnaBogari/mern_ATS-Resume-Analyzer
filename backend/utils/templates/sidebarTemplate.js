import {
  PAGE_LAYOUT,
  TYPOGRAPHY,
  COLORS,
  SPACING,
  renderSectionTitle,
  renderBodyText,
  renderBulletList,
  wouldExceedPage,
  addNewPage,
  cleanContent,
  formatExperienceItem,
  formatEducationItem,
} from './pdfHelpers.js';

/* ========================================================================
   SIDEBAR TEMPLATE - Professional dark sidebar layout with content area
   Sidebar appears on every page
======================================================================== */

const SIDEBAR_WIDTH = 180;
const CONTENT_X = SIDEBAR_WIDTH + 30;
const CONTENT_WIDTH = PAGE_LAYOUT.width - CONTENT_X - PAGE_LAYOUT.margin;

/**
 * Render sidebar that appears on every page
 */
const renderSidebar = (doc, content) => {
  const sidebarX = 0;
  const sidebarWidth = SIDEBAR_WIDTH;

  // Sidebar background
  doc
    .rect(sidebarX, 0, sidebarWidth, PAGE_LAYOUT.height)
    .fill("#1a2952");

  let sidebarY = PAGE_LAYOUT.margin + 20;

  // Name (smaller on sidebar)
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor("white")
    .text(content.name || "YOUR NAME", sidebarX + 15, sidebarY, {
      width: sidebarWidth - 30,
      align: "left",
    });

  sidebarY = doc.y + 15;

  // Contact info
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#B0B8D4");

  if (content.email) {
    doc.text(content.email, sidebarX + 15, sidebarY, {
      width: sidebarWidth - 30,
    });
    sidebarY = doc.y + 2;
  }

  if (content.phone) {
    doc.text(content.phone, sidebarX + 15, sidebarY, {
      width: sidebarWidth - 30,
    });
    sidebarY = doc.y + 8;
  }

  if (content.linkedin) {
    doc.text(content.linkedin, sidebarX + 15, sidebarY, {
      width: sidebarWidth - 30,
      fontSize: 8,
    });
    sidebarY = doc.y + 2;
  }

  if (content.github) {
    doc.text(content.github, sidebarX + 15, sidebarY, {
      width: sidebarWidth - 30,
      fontSize: 8,
    });
    sidebarY = doc.y + 15;
  }

  // Skills section on sidebar
  if (content.skills && content.skills.length > 0) {
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("white")
      .text("SKILLS", sidebarX + 15, sidebarY);

    sidebarY = doc.y + 8;

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#B0B8D4");

    const skills = Array.isArray(content.skills)
      ? content.skills
      : [content.skills];
    const cleanedSkills = cleanContent(skills).slice(0, 8); // Limit to fit sidebar

    for (const skill of cleanedSkills) {
      if (sidebarY + 12 > PAGE_LAYOUT.height - PAGE_LAYOUT.margin) {
        break; // Don't overflow sidebar
      }
      doc.text(`• ${skill}`, sidebarX + 15, sidebarY, {
        width: sidebarWidth - 30,
      });
      sidebarY = doc.y + 6;
    }

    sidebarY += 8;
  }

  // Certifications section on sidebar
  if (content.certifications && content.certifications.length > 0) {
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("white")
      .text("CERTIFICATIONS", sidebarX + 15, sidebarY);

    sidebarY = doc.y + 8;

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#B0B8D4");

    const certs = Array.isArray(content.certifications)
      ? content.certifications
      : [content.certifications];
    const cleanedCerts = cleanContent(certs).slice(0, 6);

    for (const cert of cleanedCerts) {
      if (sidebarY + 12 > PAGE_LAYOUT.height - PAGE_LAYOUT.margin) {
        break;
      }
      doc.text(`• ${cert}`, sidebarX + 15, sidebarY, {
        width: sidebarWidth - 30,
      });
      sidebarY = doc.y + 6;
    }
  }
};

/**
 * Render main content area (right side)
 */
const renderSummarySection = (doc, summary, y) => {
  if (!summary || String(summary).trim() === "") return y;

  let currentY = y;

  if (wouldExceedPage(currentY, 30)) {
    return currentY;
  }

  currentY = renderSectionTitle(
    doc,
    "PROFESSIONAL SUMMARY",
    CONTENT_X,
    currentY,
    CONTENT_WIDTH
  );
  currentY = renderBodyText(
    doc,
    String(summary).trim(),
    CONTENT_X,
    currentY,
    CONTENT_WIDTH
  );

  return currentY;
};

/**
 * Render education section
 */
const renderEducationSection = (doc, education, y) => {
  if (!education || education.length === 0) return y;

  let currentY = y;

  if (wouldExceedPage(currentY, 30)) {
    currentY = PAGE_LAYOUT.margin + 20;
    renderSidebar(doc, {}); // Redraw sidebar on new page
  }

  currentY = renderSectionTitle(
    doc,
    "EDUCATION",
    CONTENT_X,
    currentY,
    CONTENT_WIDTH
  );

  const educationArray = Array.isArray(education)
    ? education
    : [education];
  const cleanedEdu = cleanContent(educationArray);

  for (const edu of cleanedEdu) {
    const eduText = formatEducationItem(edu);
    if (!eduText.trim()) continue;

    const estimatedHeight = doc.heightOfString(eduText, {
      width: CONTENT_WIDTH,
      lineGap: SPACING.lineHeight,
    }) + SPACING.itemGap;

    if (wouldExceedPage(currentY, estimatedHeight + 20)) {
      doc.addPage();
      renderSidebar(doc, {});
      currentY = PAGE_LAYOUT.margin + 20;
    }

    doc
      .font("Helvetica")
      .fontSize(TYPOGRAPHY.sectionBody.size)
      .fillColor(COLORS.text)
      .text(eduText, CONTENT_X, currentY, {
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
const renderProjectsSection = (doc, projects, y) => {
  if (!projects || projects.length === 0) return y;

  let currentY = y;

  if (wouldExceedPage(currentY, 30)) {
    doc.addPage();
    renderSidebar(doc, {});
    currentY = PAGE_LAYOUT.margin + 20;
  }

  currentY = renderSectionTitle(
    doc,
    "PROJECTS",
    CONTENT_X,
    currentY,
    CONTENT_WIDTH
  );

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
      doc.addPage();
      renderSidebar(doc, {});
      currentY = PAGE_LAYOUT.margin + 20;
    }

    doc
      .font("Helvetica")
      .fontSize(TYPOGRAPHY.sectionBody.size)
      .fillColor(COLORS.text)
      .text(projText, CONTENT_X, currentY, {
        width: CONTENT_WIDTH,
        lineGap: SPACING.lineHeight,
      });

    currentY = doc.y + SPACING.itemGap;
  }

  return currentY + SPACING.sectionGap;
};

/**
 * Render experience section
 */
const renderExperienceSection = (doc, experience, y) => {
  if (!experience || experience.length === 0) return y;

  let currentY = y;

  if (wouldExceedPage(currentY, 30)) {
    doc.addPage();
    renderSidebar(doc, {});
    currentY = PAGE_LAYOUT.margin + 20;
  }

  currentY = renderSectionTitle(
    doc,
    "EXPERIENCE",
    CONTENT_X,
    currentY,
    CONTENT_WIDTH
  );

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
      doc.addPage();
      renderSidebar(doc, {});
      currentY = PAGE_LAYOUT.margin + 20;
    }

    doc
      .font("Helvetica")
      .fontSize(TYPOGRAPHY.sectionBody.size)
      .fillColor(COLORS.text)
      .text(expText, CONTENT_X, currentY, {
        width: CONTENT_WIDTH,
        lineGap: SPACING.lineHeight,
      });

    currentY = doc.y + SPACING.itemGap;
  }

  return currentY + SPACING.sectionGap;
};

/**
 * Main template renderer
 */
export const generateSidebarTemplate = (doc, content) => {
  // Initial sidebar on first page
  renderSidebar(doc, content);

  let y = PAGE_LAYOUT.margin + 20;

  // Render content sections
  y = renderSummarySection(doc, content.summary, y);
  y = renderEducationSection(doc, content.education, y);
  y = renderProjectsSection(doc, content.projects, y);
  y = renderExperienceSection(doc, content.experience, y);
};
