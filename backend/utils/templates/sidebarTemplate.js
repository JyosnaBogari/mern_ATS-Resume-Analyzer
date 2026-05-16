const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const PAGE_MARGIN = 40;
const PAGE_BOTTOM = PAGE_HEIGHT - PAGE_MARGIN;
const SIDEBAR_WIDTH = 180;

const formatListValue = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") {
    if (item.company || item.position) {
      return `${item.position || ""}${item.company ? ` @ ${item.company}` : ""}`.trim();
    }
    if (item.institution || item.degree || item.year) {
      return `${item.degree || ""}${item.institution ? ` • ${item.institution}` : ""}${item.year ? ` (${item.year})` : ""}`.trim();
    }
    if (item.title || item.name) {
      return item.title || item.name;
    }
    return Object.values(item).filter(Boolean).join(" • ");
  }
  return String(item);
};

const formatContentText = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value
      .map((item) => formatListValue(item))
      .filter(Boolean)
      .join("\n\n");
  }
  return String(value);
};

let currentContent = null;
let sidebarRendered = false;

const renderSidebar = (doc, content) => {
  doc
    .rect(0, 0, SIDEBAR_WIDTH, PAGE_HEIGHT)
    .fill("#172554");

  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(28)
    .text(content.name || "YOUR NAME", 30, 50, { width: 120 });

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(content.email || "", 30, 130, { width: 120 });

  doc.text(content.phone || "", 30, 150, { width: 120 });

  const addSidebarSection = (title, items, y) => {
    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(15)
      .text(title, 30, y);

    y += 24;

    doc.font("Helvetica").fontSize(10);

    items?.slice(0, 6).forEach((item) => {
      doc.text(`• ${formatListValue(item)}`, 30, y, {
        width: 120,
        lineGap: 4
      });
      y = doc.y + 10;
    });

    return y + 10;
  };

  let sidebarY = 220;
  sidebarY = addSidebarSection("SKILLS", content.skills || [], sidebarY);
  sidebarY = addSidebarSection("CERTIFICATIONS", content.certifications || [], sidebarY);
};

const ensurePageSpace = (doc, y, requiredHeight) => {
  if (y + requiredHeight > PAGE_BOTTOM) {
    doc.addPage();
    if (sidebarRendered) {
      sidebarRendered = false;
    }
    return PAGE_MARGIN;
  }
  return y;
};

const addContentSection = (doc, title, text, x, y) => {
  doc.font("Helvetica-Bold").fontSize(18);
  const titleHeight = doc.heightOfString(title, { width: 320, lineGap: 4 });

  doc.font("Helvetica").fontSize(11);
  const contentHeight = doc.heightOfString(text || "", { width: 320, lineGap: 6 });

  const sectionHeight = titleHeight + contentHeight + 36;
  y = ensurePageSpace(doc, y, sectionHeight);

  doc
    .fillColor("#2563EB")
    .font("Helvetica-Bold")
    .fontSize(18)
    .text(title, x, y);

  y += titleHeight + 6;

  doc
    .moveTo(x, y)
    .lineTo(PAGE_WIDTH - PAGE_MARGIN, y)
    .strokeColor("#93C5FD")
    .lineWidth(1)
    .stroke();

  y += 16;

  doc
    .fillColor("#111827")
    .font("Helvetica")
    .fontSize(11)
    .text(text || "", x, y, {
      width: 320,
      lineGap: 6,
      align: "left"
    });

  return doc.y + 22;
};

export const generateSidebarTemplate = (doc, content) => {
  currentContent = content;
  sidebarRendered = true;
  renderSidebar(doc, content);

  let x = SIDEBAR_WIDTH + 40;
  let y = 60;

  y = addContentSection(doc, "PROFESSIONAL SUMMARY", content.summary, x, y);
  y = addContentSection(doc, "EDUCATION", formatContentText(content.education), x, y);
  y = addContentSection(doc, "PROJECTS", formatContentText(content.projects), x, y);

  if (content.experience) {
    y = addContentSection(doc, "EXPERIENCE", formatContentText(content.experience), x, y);
  }
};
