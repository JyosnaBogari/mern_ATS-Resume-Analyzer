/* ========================================================================
   PDF RENDERING HELPERS - Reusable utility functions for consistent
   PDF generation across all resume templates
======================================================================== */

// PAGE CONSTANTS
export const PAGE_LAYOUT = {
  width: 595,
  height: 842,
  margin: 40,
  get bottomEdge() {
    return this.height - this.margin;
  },
};

// TYPOGRAPHY CONSTANTS
export const TYPOGRAPHY = {
  headerName: { size: 24, leading: 28 },
  headerSub: { size: 10, leading: 12 },
  sectionTitle: { size: 12, bold: true, leading: 14 },
  sectionBody: { size: 10, leading: 14 },
  itemTitle: { size: 10, bold: true, leading: 12 },
  itemMeta: { size: 9, leading: 11 },
  bulletText: { size: 10, leading: 13 },
};

// COLOR SCHEME (Apple-inspired)
export const COLORS = {
  primary: "#0066CC",
  primaryLight: "#E8F1FF",
  primaryDark: "#004499",
  text: "#1D1D1F",
  textSecondary: "#6E6E73",
  textMuted: "#A1A1A6",
  border: "#D5D5D7",
  borderLight: "#F5F5F7",
  background: "#FFFFFF",
};

// SPACING CONSTANTS
export const SPACING = {
  headerHeight: 100,
  headerToContent: 30,
  sectionGap: 12,
  sectionTitleGap: 6,
  itemGap: 8,
  bulletIndent: 12,
  bulletSpacing: 4,
  paragraphGap: 8,
  lineHeight: 4,
};

// ========================================================================
// PAGE MANAGEMENT
// ========================================================================

/**
 * Check if adding content would exceed page boundaries
 * @param {PDFDocument} doc - PDFKit document
 * @param {number} currentY - Current Y position
 * @param {number} contentHeight - Height of content to add
 * @returns {boolean} True if content would exceed page
 */
export const wouldExceedPage = (currentY, contentHeight) => {
  return currentY + contentHeight > PAGE_LAYOUT.bottomEdge;
};

/**
 * Get available space remaining on current page
 * @param {number} currentY - Current Y position
 * @returns {number} Available height in points
 */
export const getAvailableSpace = (currentY) => {
  return PAGE_LAYOUT.bottomEdge - currentY;
};

/**
 * Create new page and return top margin position
 * @param {PDFDocument} doc - PDFKit document
 * @param {function} headerRenderer - Optional function to render header on new page
 * @returns {number} Top position for new page content
 */
export const addNewPage = (doc, headerRenderer = null) => {
  doc.addPage();
  if (headerRenderer) headerRenderer();
  return PAGE_LAYOUT.margin;
};

// ========================================================================
// TEXT RENDERING
// ========================================================================

/**
 * Render section title with underline
 * @param {PDFDocument} doc - PDFKit document
 * @param {string} title - Section title text
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width of section
 * @returns {number} New Y position after title
 */
export const renderSectionTitle = (doc, title, x, y, width) => {
  const titleY = y;

  doc
    .font("Helvetica-Bold")
    .fontSize(TYPOGRAPHY.sectionTitle.size)
    .fillColor(COLORS.primary)
    .text(title, x, titleY, { width, lineGap: 0 });

  const titleHeight = doc.heightOfString(title, {
    width,
    lineGap: 0,
  });

  const underlineY = titleY + titleHeight + 4;
  doc
    .moveTo(x, underlineY)
    .lineTo(x + width, underlineY)
    .strokeColor(COLORS.primary)
    .lineWidth(1)
    .stroke();

  return underlineY + SPACING.sectionTitleGap;
};

/**
 * Render formatted body text
 * @param {PDFDocument} doc - PDFKit document
 * @param {string} text - Text content
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width constraint
 * @returns {number} New Y position
 */
export const renderBodyText = (doc, text, x, y, width) => {
  if (!text || text.trim() === "") return y;

  doc
    .font("Helvetica")
    .fontSize(TYPOGRAPHY.sectionBody.size)
    .fillColor(COLORS.text)
    .text(text, x, y, {
      width,
      lineGap: SPACING.lineHeight,
    });

  return doc.y + SPACING.sectionGap;
};

/**
 * Render bullet list
 * @param {PDFDocument} doc - PDFKit document
 * @param {array} items - Array of text items
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width constraint
 * @returns {number} New Y position
 */
export const renderBulletList = (doc, items, x, y, width) => {
  if (!items || items.length === 0) return y;

  const filteredItems = items.filter((item) => item && String(item).trim());
  let currentY = y;

  doc
    .font("Helvetica")
    .fontSize(TYPOGRAPHY.bulletText.size)
    .fillColor(COLORS.text);

  for (const item of filteredItems) {
    const text = String(item).trim();
    const bulletX = x;
    const textX = x + SPACING.bulletIndent;
    const textWidth = width - SPACING.bulletIndent;

    // Draw bullet
    doc
      .font("Helvetica")
      .fontSize(TYPOGRAPHY.bulletText.size)
      .text("•", bulletX, currentY, { width: SPACING.bulletIndent });

    // Calculate text height
    const textHeight = doc.heightOfString(text, {
      width: textWidth,
      lineGap: SPACING.lineHeight,
    });

    // Render text next to bullet
    doc
      .font("Helvetica")
      .fontSize(TYPOGRAPHY.bulletText.size)
      .text(text, textX, currentY, {
        width: textWidth,
        lineGap: SPACING.lineHeight,
      });

    currentY = doc.y + SPACING.bulletSpacing;
  }

  return currentY + SPACING.sectionGap;
};

/**
 * Render a complete section with automatic page breaking
 * @param {PDFDocument} doc - PDFKit document
 * @param {object} config - Configuration object
 * @returns {number} New Y position
 */
export const renderSection = (doc, config) => {
  const {
    title,
    content,
    x,
    y,
    width,
    contentType = "text", // 'text', 'bullets', 'experience', 'education'
    onPageBreak = null,
  } = config;

  if (!content) return y;

  // Check if section header fits
  const headerHeight = 20; // Approximate
  if (wouldExceedPage(y + headerHeight, 40)) {
    return addNewPage(doc, onPageBreak);
  }

  let currentY = renderSectionTitle(doc, title, x, y, width);

  switch (contentType) {
    case "bullets":
      if (Array.isArray(content)) {
        currentY = renderBulletList(doc, content, x, currentY, width);
      } else {
        currentY = renderBodyText(
          doc,
          String(content),
          x,
          currentY,
          width
        );
      }
      break;

    case "experience":
    case "education":
      currentY = renderExperienceBlock(doc, content, x, currentY, width, onPageBreak);
      break;

    default:
      currentY = renderBodyText(doc, String(content), x, currentY, width);
  }

  return currentY;
};

/**
 * Render experience/education block with proper formatting
 * @param {PDFDocument} doc - PDFKit document
 * @param {array|string} content - Content to render
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width constraint
 * @param {function} onPageBreak - Page break callback
 * @returns {number} New Y position
 */
export const renderExperienceBlock = (doc, content, x, y, width, onPageBreak) => {
  if (!content) return y;

  let currentY = y;
  const items = Array.isArray(content) ? content : [content];

  for (const item of items) {
    if (!item) continue;

    const itemStr = String(item).trim();
    if (!itemStr) continue;

    // Check space for item
    const estimatedHeight = doc.heightOfString(itemStr, {
      width,
      lineGap: SPACING.lineHeight,
    }) + SPACING.itemGap;

    if (wouldExceedPage(currentY, estimatedHeight)) {
      currentY = addNewPage(doc, onPageBreak);
    }

    doc
      .font("Helvetica")
      .fontSize(TYPOGRAPHY.bulletText.size)
      .fillColor(COLORS.text)
      .text(itemStr, x, currentY, {
        width,
        lineGap: SPACING.lineHeight,
      });

    currentY = doc.y + SPACING.itemGap;
  }

  return currentY + SPACING.sectionGap;
};

/**
 * Render contact information in header format
 * @param {PDFDocument} doc - PDFKit document
 * @param {object} contactInfo - Contact details
 * @param {number} x - X position
 * @param {number} y - Y position
 * @returns {number} New Y position
 */
export const renderContactInfo = (doc, contactInfo, x, y) => {
  const { email, phone, linkedin, github } = contactInfo;
  const items = [email, phone, linkedin, github].filter(Boolean);
  const contact = items.join(" | ");

  if (!contact) return y;

  doc
    .font("Helvetica")
    .fontSize(TYPOGRAPHY.headerSub.size)
    .fillColor(COLORS.textSecondary)
    .text(contact, x, y, {
      width: PAGE_LAYOUT.width - x * 2,
      lineGap: 0,
    });

  return doc.y + 8;
};

/**
 * Format experience/education item for display
 * @param {object} item - Experience/education object
 * @returns {string} Formatted text
 */
export const formatExperienceItem = (item) => {
  if (typeof item === "string") return item;
  if (!item) return "";

  const parts = [];

  // Title and company
  if (item.position || item.company) {
    const title = `${item.position || ""}${
      item.company ? ` @ ${item.company}` : ""
    }`.trim();
    if (title) parts.push(title);
  }

  // Duration
  if (item.duration) parts.push(`(${item.duration})`);

  // Description
  if (item.description) parts.push(item.description);

  return parts.filter(Boolean).join("\n");
};

/**
 * Format education item for display
 * @param {object} item - Education object
 * @returns {string} Formatted text
 */
export const formatEducationItem = (item) => {
  if (typeof item === "string") return item;
  if (!item) return "";

  const parts = [];

  // Degree and institution
  if (item.degree || item.institution) {
    const edu = `${item.degree || ""}${
      item.institution ? ` • ${item.institution}` : ""
    }`.trim();
    if (edu) parts.push(edu);
  }

  // Year
  if (item.year) parts.push(`(${item.year})`);

  return parts.filter(Boolean).join("\n");
};

/**
 * Trim and validate content
 * @param {any} content - Content to validate
 * @returns {any} Cleaned content
 */
export const cleanContent = (content) => {
  if (typeof content === "string") {
    return content.trim();
  }
  if (Array.isArray(content)) {
    return content
      .filter((item) => item && String(item).trim())
      .map((item) =>
        typeof item === "string" ? item.trim() : item
      );
  }
  return content;
};
