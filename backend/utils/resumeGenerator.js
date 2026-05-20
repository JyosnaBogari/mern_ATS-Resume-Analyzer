import puppeteer from "puppeteer";

/* =========================================================
   ESCAPE HTML
========================================================= */

const escapeHtml = (text = "") => {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

/* =========================================================
   NORMALIZE STRUCTURED RESUME DATA
========================================================= */

const normalizeResumeData = (resumeData = {}) => {
  const contact = resumeData.contact || {};

  return {
    contact: {
      name: contact.name || "YOUR NAME",
      phone: contact.phone || "",
      email: contact.email || "",
      linkedin: contact.linkedin || "",
      github: contact.github || "",
      location: contact.location || "",
    },

    summary: resumeData.summary || "",

    skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],

    education: Array.isArray(resumeData.education)
      ? resumeData.education
      : [],

    experience: Array.isArray(resumeData.experience)
      ? resumeData.experience
      : [],

    projects: Array.isArray(resumeData.projects)
      ? resumeData.projects
      : [],

    certifications: Array.isArray(resumeData.certifications)
      ? resumeData.certifications
      : [],

    achievements: Array.isArray(resumeData.achievements)
      ? resumeData.achievements
      : [],

    languages: Array.isArray(resumeData.languages)
      ? resumeData.languages
      : [],

    coursework: Array.isArray(resumeData.coursework)
      ? resumeData.coursework
      : [],
  };
};

const getContactLine = (content) => {
  return [
    content.contact.phone,
    content.contact.email,
    content.contact.linkedin,
    content.contact.github,
    content.contact.location,
  ]
    .filter(Boolean)
    .join(" | ");
};

/* =========================================================
   COMMON RENDER HELPERS
========================================================= */

const renderList = (items = []) => {
  if (!items.length) return "";

  return `
    <ul>
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
};

const renderSection = (title, content) => {
  if (!content || (Array.isArray(content) && content.length === 0)) return "";

  return `
    <section class="section">
      <h2>${title}</h2>
      ${Array.isArray(content)
      ? renderList(content)
      : `<p>${escapeHtml(content)}</p>`
    }
    </section>
  `;
};

const renderEducation = (education = []) => {
  if (!education.length) return "";

  return `
    <section class="section">
      <h2>Education</h2>
      ${education
      .map(
        (edu) => `
        <div class="item">
          <strong>${escapeHtml(edu.degree || "")}</strong>
          <p>${escapeHtml(edu.institution || "")}</p>
          <p>${escapeHtml(
          [edu.location, edu.year, edu.score].filter(Boolean).join(" | ")
        )}</p>
        </div>
      `
      )
      .join("")}
    </section>
  `;
};

const renderProjects = (projects = []) => {
  if (!projects.length) return "";

  return `
    <section class="section">
      <h2>Projects</h2>
      ${projects
      .map(
        (project) => `
        <div class="item">
          <strong>${escapeHtml(project.title || "")}</strong>

          ${Array.isArray(project.description)
            ? `
            <ul>
              ${project.description
              .map((desc) => `<li>${escapeHtml(desc)}</li>`)
              .join("")}
            </ul>
          `
            : project.description
              ? `<p>${escapeHtml(project.description)}</p>`
              : ""
          }

          ${Array.isArray(project.technologies) &&
            project.technologies.length > 0
            ? `<p><strong>Tech:</strong> ${escapeHtml(
              project.technologies.join(", ")
            )}</p>`
            : ""
          }
        </div>
      `
      )
      .join("")}
    </section>
  `;
};

const renderExperience = (experience = []) => {
  if (!experience.length) return "";

  return `
    <section class="section">
      <h2>Experience</h2>
      ${experience
      .map((exp) => {
        if (typeof exp === "string") {
          return `<p>${escapeHtml(exp)}</p>`;
        }

        return `
            <div class="item">
              <strong>${escapeHtml(exp.role || exp.title || "")}</strong>
              <p>${escapeHtml(
          [exp.company, exp.location, exp.duration]
            .filter(Boolean)
            .join(" | ")
        )}</p>

              ${Array.isArray(exp.description)
            ? renderList(exp.description)
            : exp.description
              ? `<p>${escapeHtml(exp.description)}</p>`
              : ""
          }
            </div>
          `;
      })
      .join("")}
    </section>
  `;
};

/* =========================================================
   MODERN TEMPLATE
========================================================= */

const modernTemplate = (content) => {
  const contactLine = getContactLine(content);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
      background: white;
      font-size: 11px;
      line-height: 1.45;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 18mm 18mm 16mm;
      background: white;
    }

    .header {
      border-bottom: 3px solid #2563eb;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }

    .name {
      font-size: 28px;
      font-weight: 800;
      color: #111827;
      letter-spacing: 0.5px;
      margin: 0;
      text-transform: uppercase;
    }

    .contact {
      margin-top: 6px;
      color: #4b5563;
      font-size: 10.5px;
      word-break: break-word;
    }

    .section {
      margin-bottom: 14px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .section h2 {
      font-size: 13px;
      color: #2563eb;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin: 0 0 7px;
      padding-bottom: 4px;
      border-bottom: 1px solid #93c5fd;
    }

    .section p {
      margin: 0 0 4px;
      text-align: left;
    }

    ul {
      margin: 4px 0 0;
      padding-left: 16px;
    }

    li {
      margin-bottom: 4px;
      padding-left: 2px;
    }

    .item {
      margin-bottom: 10px;
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }

    .skill-pill {
      border: 1px solid #dbeafe;
      background: #eff6ff;
      color: #1e40af;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 600;
    }

    @page {
      size: A4;
      margin: 0;
    }
  </style>
</head>

<body>
  <div class="page">
    <header class="header">
      <h1 class="name">${escapeHtml(content.contact.name)}</h1>
      <div class="contact">${escapeHtml(contactLine)}</div>
    </header>

    ${renderSection("Summary", content.summary)}

    ${content.skills.length
      ? `
      <section class="section">
        <h2>Skills</h2>
        <div class="skills-list">
          ${content.skills
        .slice(0, 30)
        .map(
          (skill) =>
            `<span class="skill-pill">${escapeHtml(skill)}</span>`
        )
        .join("")}
        </div>
      </section>
    `
      : ""
    }

    ${renderExperience(content.experience)}
    ${renderProjects(content.projects)}
    ${renderEducation(content.education)}
    ${renderSection("Certifications", content.certifications)}
    ${renderSection("Achievements", content.achievements)}
    ${renderSection("Coursework", content.coursework)}
    ${renderSection("Languages", content.languages)}
  </div>
</body>
</html>
`;
};

/* =========================================================
   SIDEBAR TEMPLATE
========================================================= */

const sidebarTemplate = (content) => {
  const contactLine = getContactLine(content);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
      background: white;
      font-size: 10.5px;
      line-height: 1.4;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      display: grid;
      grid-template-columns: 34% 66%;
      background: white;
    }

    .sidebar {
      background: #172554;
      color: white;
      padding: 14mm 8mm;
    }

    .main {
      padding: 14mm 12mm;
      background: white;
    }

    .name {
      font-size: 23px;
      font-weight: 800;
      line-height: 1.1;
      margin: 0 0 14px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .contact {
      font-size: 9.5px;
      color: #dbeafe;
      word-break: break-word;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .side-section {
      margin-bottom: 18px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .side-section h2 {
      color: #bfdbfe;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 8px;
      border-bottom: 1px solid rgba(255,255,255,0.35);
      padding-bottom: 5px;
    }

    .side-section ul,
    .section ul {
      margin: 0;
      padding-left: 16px;
    }

    .side-section li {
      margin-bottom: 5px;
      color: #f8fafc;
    }

    .section {
      margin-bottom: 12px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .section h2 {
      font-size: 13px;
      color: #2563eb;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin: 0 0 7px;
      padding-bottom: 4px;
      border-bottom: 1px solid #93c5fd;
    }

    .section p {
      margin: 0 0 4px;
    }

    .section li {
      margin-bottom: 4px;
    }

    .item {
      margin-bottom: 10px;
    }

    @page {
      size: A4;
      margin: 0;
    }
  </style>
</head>

<body>
  <div class="page">

    <aside class="sidebar">
      <h1 class="name">${escapeHtml(content.contact.name)}</h1>

      <div class="contact">
        ${escapeHtml(contactLine).replaceAll(" | ", "<br/>")}
      </div>

      ${content.skills.length
      ? `
        <div class="side-section">
          <h2>Skills</h2>
          ${renderList(content.skills.slice(0, 24))}
        </div>
      `
      : ""
    }

      ${content.certifications.length
      ? `
        <div class="side-section">
          <h2>Certifications</h2>
          ${renderList(content.certifications.slice(0, 10))}
        </div>
      `
      : ""
    }

      ${content.languages.length
      ? `
        <div class="side-section">
          <h2>Languages</h2>
          ${renderList(content.languages.slice(0, 6))}
        </div>
      `
      : ""
    }

      ${content.coursework.length
      ? `
        <div class="side-section">
          <h2>Coursework</h2>
          ${renderList(content.coursework.slice(0, 8))}
        </div>
      `
      : ""
    }
    </aside>

    <main class="main">
      ${renderSection("Summary", content.summary)}
      ${renderExperience(content.experience)}
      ${renderProjects(content.projects)}
      ${renderEducation(content.education)}
      ${renderSection("Achievements", content.achievements)}
    </main>

  </div>
</body>
</html>
`;
};

/* =========================================================
   RAW RESUME TEMPLATE
========================================================= */
/* =========================================================
   PARSE RAW TEXT SAME AS FRONTEND PREVIEW
========================================================= */

const parseResumeText = (text = "") => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = {
    contact: [],
    summary: [],
    skills: [],
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    languages: [],
    coursework: [],
  };

  const sectionMap = {
    SUMMARY: "summary",
    "PROFESSIONAL SUMMARY": "summary",
    SKILLS: "skills",
    PROJECTS: "projects",
    EDUCATION: "education",
    CERTIFICATIONS: "certifications",
    CERTIFICATION: "certifications",
    ACHIEVEMENTS: "achievements",
    ACHIEVEMENT: "achievements",
    LANGUAGES: "languages",
    LANGUAGE: "languages",
    COURSEWORK: "coursework",
  };

  let current = "contact";

  for (const line of lines) {
    const upper = line.toUpperCase();

    if (sectionMap[upper]) {
      current = sectionMap[upper];
      continue;
    }

    sections[current].push(line);
  }

  return sections;
};

const rawHeader = (data, center = false, dark = false) => {
  const contact = data.contact || [];

  const name =
    contact.find((x) => /^[A-Z ]{5,}$/.test(x)) ||
    contact[0] ||
    "YOUR NAME";

  const other = contact.filter((x) => x !== name);

  return `
    <header class="${center ? "center" : ""} header">
      <h1>${escapeHtml(name)}</h1>
      <div class="${dark ? "contact dark" : "contact"}">
        ${other.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
      </div>
    </header>
  `;
};

const rawSection = (title, items = [], options = {}) => {
  if (!items || items.length === 0) return "";

  const { paragraph = false, inline = false, dark = false } = options;

  return `
    <section class="section ${dark ? "dark-section" : ""}">
      <h2>${escapeHtml(title)}</h2>
      ${paragraph
      ? `<p>${escapeHtml(items.join(" "))}</p>`
      : inline
        ? `<p>${escapeHtml(items.join(" • "))}</p>`
        : `<ul>${items
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}</ul>`
    }
    </section>
  `;
};

/* =========================================================
   CLASSIC - MATCH FRONTEND PREVIEW
========================================================= */

const rawClassicTemplate = (text) => {
  const data = parseResumeText(text);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    @page { size: A4; margin: 0; }

    body {
      margin: 0;
      background: white;
      color: black;
      font-family: Georgia, serif;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      box-sizing: border-box;
      background: white;
      line-height: 1.6;
    }

    .center { text-align: center; }

    .header {
      margin-bottom: 24px;
    }

    .header h1 {
      font-size: 26px;
      font-weight: bold;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: 0;
    }

    .contact {
      font-size: 13px;
      margin-top: 8px;
      color: #374151;
    }

    .contact p {
      margin: 3px 0;
    }

    .section {
      margin-bottom: 20px;
    }

    .section h2 {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-bottom: 1px solid black;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }

    .section p,
    .section li {
      font-size: 13.5px;
      line-height: 1.7;
      color: #1f2937;
    }

    ul {
      margin: 0;
      padding-left: 18px;
    }

    li {
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <div class="page">
    ${rawHeader(data, true)}
    ${rawSection("Professional Summary", data.summary, { paragraph: true })}
    ${rawSection("Skills", data.skills, { inline: true })}
    ${rawSection("Projects", data.projects)}
    ${rawSection("Education", data.education)}
    ${rawSection("Certifications", data.certifications)}
    ${rawSection("Achievements", data.achievements)}
    ${rawSection("Coursework", data.coursework, { inline: true })}
    ${rawSection("Languages", data.languages, { inline: true })}
  </div>
</body>
</html>
`;
};

/* =========================================================
   MODERN - MATCH FRONTEND PREVIEW
========================================================= */

const rawModernTemplate = (text) => {
  const data = parseResumeText(text);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    @page { size: A4; margin: 0; }

    body {
      margin: 0;
      background: white;
      color: black;
      font-family: Arial, Helvetica, sans-serif;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      display: grid;
      grid-template-columns: 74mm 1fr;
      background: white;
    }

    .sidebar {
      background: #172554;
      color: white;
      padding: 18mm 9mm;
      box-sizing: border-box;
    }

    .main {
      padding: 18mm 12mm;
      box-sizing: border-box;
    }

    .header {
      margin-bottom: 24px;
    }

    .header h1 {
      font-size: 24px;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
    }

    .contact {
      font-size: 12px;
      margin-top: 14px;
      color: #dbeafe;
      line-height: 1.6;
    }

    .contact p {
      margin: 4px 0;
    }

    .section {
      margin-bottom: 20px;
    }

    .section h2 {
      font-size: 13px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-bottom: 1px solid #111827;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }

    .dark-section h2 {
      color: white;
      border-bottom: 1px solid #bfdbfe;
    }

    .section p,
    .section li {
      font-size: 13px;
      line-height: 1.7;
      color: #1f2937;
    }

    .dark-section p,
    .dark-section li {
      color: #eff6ff;
    }

    ul {
      margin: 0;
      padding-left: 18px;
    }

    li {
      margin-bottom: 6px;
    }
  </style>
</head>
<body>
  <div class="page">
    <aside class="sidebar">
      ${rawHeader(data, false, true)}
      ${rawSection("Skills", data.skills, { inline: true, dark: true })}
      ${rawSection("Coursework", data.coursework, { dark: true })}
      ${rawSection("Languages", data.languages, { dark: true })}
    </aside>

    <main class="main">
      ${rawSection("Professional Summary", data.summary, { paragraph: true })}
      ${rawSection("Projects", data.projects)}
      ${rawSection("Education", data.education)}
      ${rawSection("Certifications", data.certifications)}
      ${rawSection("Achievements", data.achievements)}
    </main>
  </div>
</body>
</html>
`;
};

/* =========================================================
   MINIMAL - MATCH FRONTEND PREVIEW
========================================================= */

const rawMinimalTemplate = (text) => {
  const data = parseResumeText(text);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    @page { size: A4; margin: 0; }

    body {
      margin: 0;
      background: white;
      color: black;
      font-family: Arial, Helvetica, sans-serif;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 22mm;
      box-sizing: border-box;
      background: white;
    }

    .center { text-align: center; }

    .header {
      margin-bottom: 18px;
    }

    .header h1 {
      font-size: 25px;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
    }

    .contact {
      font-size: 12.5px;
      margin-top: 8px;
      color: #374151;
    }

    .divider {
      border-top: 2px solid black;
      margin-top: 18px;
      padding-top: 18px;
    }

    .section {
      margin-bottom: 20px;
    }

    .section h2 {
      font-size: 13.5px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1.4px;
      border-bottom: 1px solid #111827;
      padding-bottom: 4px;
      margin-bottom: 10px;
    }

    .section p,
    .section li {
      font-size: 13.5px;
      line-height: 1.7;
      color: #1f2937;
    }

    ul {
      margin: 0;
      padding-left: 18px;
    }

    li {
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <div class="page">
    ${rawHeader(data, true)}

    <div class="divider">
      ${rawSection("Summary", data.summary, { paragraph: true })}
      ${rawSection("Skills", data.skills, { inline: true })}
      ${rawSection("Projects", data.projects)}
      ${rawSection("Education", data.education)}
      ${rawSection("Certifications", data.certifications)}
      ${rawSection("Achievements", data.achievements)}
      ${rawSection("Languages", data.languages, { inline: true })}
    </div>
  </div>
</body>
</html>
`;
};

const rawResumeTemplate = (text, template = "classic") => {
  if (template === "modern") return rawModernTemplate(text);
  if (template === "minimal") return rawMinimalTemplate(text);
  return rawClassicTemplate(text);
};

/* =========================================================
   GENERATE HTML
========================================================= */

const generateResumeHtml = (resume) => {
  const template = resume.template || "classic";

  const text =
    resume.improvedResume ||
    resume.extractedText ||
    resume.originalResume ||
    "";

  return rawResumeTemplate(text, template);
};
/* =========================================================
   MAIN EXPORT USED BY resumeAPI.js
========================================================= */

export const generateResumePdf = async (resume, res, source = "improved") => {
  let browser;

  try {
    const html = generateResumeHtml(resume, source);

    const safeName = (resume.originalFileName || "resume.pdf")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_ ]/g, "");

    const filename =
      source === "current"
        ? `${safeName}-edited.pdf`
        : `${safeName}-improved.pdf`;

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error("PUPPETEER PDF ERROR:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to generate resume PDF",
      });
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
export const generateImprovedResume = async (data, res) => {
  let browser;

  try {
    const template = data.template || "classic";

    const text = `
${data.firstName || ""} ${data.lastName || ""}

${data.email || ""} | ${data.phone || ""} | ${data.address || ""}

PROFESSIONAL SUMMARY
${data.summary || ""}

EXPERIENCE
${(data.experience || [])
        .map(
          (exp) => `${exp.position || ""} - ${exp.company || ""}
${exp.duration || ""}
${exp.description || ""}`
        )
        .join("\n\n")}

EDUCATION
${(data.education || [])
        .map(
          (edu) => `${edu.degree || ""} - ${edu.institution || ""}
${edu.year || ""}`
        )
        .join("\n\n")}

SKILLS
${(data.skills || []).join(" • ")}

ACHIEVEMENTS
${(data.awards || []).join("\n")}
`;

    const html = rawResumeTemplate(text, template);

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="resume.pdf"`);

    res.send(pdfBuffer);
  } catch (error) {
    console.error("RESUME GENERATION ERROR:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Resume generation failed",
      });
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};