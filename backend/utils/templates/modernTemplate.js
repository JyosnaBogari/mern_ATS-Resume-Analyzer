const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const PAGE_MARGIN = 40;
const PAGE_BOTTOM = PAGE_HEIGHT - PAGE_MARGIN;

const formatSectionText = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item) return "";
        if (typeof item === "string") {
          return item;
        }
        if (typeof item === "object") {
          const parts = [];
          if (item.position || item.company) {
            const title = `${item.position || ""}${item.company ? ` @ ${item.company}` : ""}`.trim();
            if (title) parts.push(title);
          }
          if (item.duration) parts.push(item.duration);
          if (item.description) parts.push(item.description);
          if (item.degree || item.institution || item.year) {
            const educationLine = `${item.degree || ""}${item.institution ? ` • ${item.institution}` : ""}${item.year ? ` (${item.year})` : ""}`.trim();
            if (educationLine) parts.push(educationLine);
          }
          if (item.title || item.name) {
            parts.push(item.title || item.name);
          }
          return parts.filter(Boolean).join("\n");
        }
        return String(item);
      })
      .filter(Boolean)
      .join("\n\n");
  }
  return String(value);
};

const ensurePageSpace = (doc, y, requiredHeight) => {
  if (y + requiredHeight > PAGE_BOTTOM) {
    doc.addPage();
    return PAGE_MARGIN;
  }
  return y;
};

const addSection = (doc, title, text, x, y, width = 450) => {
  doc.font("Helvetica-Bold").fontSize(13);
  const titleHeight = doc.heightOfString(title, { width, lineGap: 4 });

  doc.font("Helvetica").fontSize(10);
  const bodyHeight = doc.heightOfString(text || "", { width, lineGap: 4 });

  const sectionHeight = titleHeight + bodyHeight + 40;
  y = ensurePageSpace(doc, y, sectionHeight);

  doc
    .fillColor("#2563EB")
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(title, x, y);

  doc
    .moveTo(x, y + 18)
    .lineTo(x + width, y + 18)
    .strokeColor("#93C5FD")
    .lineWidth(1)
    .stroke();

  doc
    .fillColor("#111827")
    .font("Helvetica")
    .fontSize(10)
    .text(text || "", x, y + 28, {
      width,
      lineGap: 4
    });

  return doc.y + 20;
};

export const generateModernTemplate = (doc, content) => {
  doc
    .rect(0, 0, PAGE_WIDTH, 120)
    .fill("#2563EB");

  doc
    .fillColor("white")
    .fontSize(28)
    .font("Helvetica-Bold")
    .text(content.name || "YOUR NAME", 50, 40);

  doc
    .fontSize(11)
    .font("Helvetica")
    .text(`${content.email || ""} | ${content.phone || ""}`, 50, 80);

  let y = 150;

  y = addSection(doc, "SUMMARY", content.summary, 50, y);
  y = addSection(doc, "SKILLS", Array.isArray(content.skills) ? content.skills.join(", ") : content.skills, 50, y);
  y = addSection(doc, "EXPERIENCE", formatSectionText(content.experience), 50, y);
  y = addSection(doc, "EDUCATION", formatSectionText(content.education), 50, y);
  y = addSection(doc, "PROJECTS", formatSectionText(content.projects), 50, y);
};
