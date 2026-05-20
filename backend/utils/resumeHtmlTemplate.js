const escapeHtml = (value) => {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const formatText = (value) => {
  return escapeHtml(String(value || "")).replace(/\n/g, "<br />");
};

const renderListItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) return "";

  return items
    .map((item) => {
      const raw = String(item || "").trim();
      const lines = raw
        .split(/\n|•|▪|·|;|\|/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length === 0) return "";

      const title = escapeHtml(lines.shift());
      const bullets = lines.map(escapeHtml);

      return `
        <article class="item-card">
          <div class="item-title">${title}</div>
          ${bullets.length
            ? `<ul class="item-list">${bullets.map((line) => `<li>${line}</li>`).join("")}</ul>`
            : `<p class="item-details">${title}</p>`}
        </article>
      `;
    })
    .join("");
};

const renderNavbarContact = (content) => {
  const values = [];
  if (content.email) values.push(escapeHtml(content.email));
  if (content.phone) values.push(escapeHtml(content.phone));
  if (content.linkedin) values.push(escapeHtml(content.linkedin));
  if (content.github) values.push(escapeHtml(content.github));
  return values.map((value) => `<span>${value}</span>`).join("");
};

const renderSkills = (skills) => {
  if (!Array.isArray(skills) || skills.length === 0) return "";

  return `
    <section class="section">
      <div class="section-header"><h2>Skills</h2></div>
      <div class="skills-grid">
        ${skills
          .slice(0, 18)
          .map((skill) => `<span class="skill-pill">${escapeHtml(skill)}</span>`)
          .join("")}
      </div>
    </section>
  `;
};

const renderEducation = (education) => {
  if (!Array.isArray(education) || education.length === 0) return "";

  return `
    <section class="section">
      <div class="section-header"><h2>Education</h2></div>
      <div class="section-body">
        ${education
          .slice(0, 5)
          .map((item) => `<p class="item-details">${escapeHtml(String(item))}</p>`)
          .join("")}
      </div>
    </section>
  `;
};

const renderCertifications = (certifications) => {
  if (!Array.isArray(certifications) || certifications.length === 0) return "";

  return `
    <section class="section">
      <div class="section-header"><h2>Certifications</h2></div>
      <div class="section-body">
        ${certifications
          .slice(0, 6)
          .map((item) => `<p class="item-details">${escapeHtml(String(item))}</p>`)
          .join("")}
      </div>
    </section>
  `;
};

const renderSection = (title, items) => {
  if (!Array.isArray(items) || items.length === 0) return "";

  return `
    <section class="section">
      <h2>${escapeHtml(title)}</h2>
      <div class="section-body">
        ${renderListItems(items)}
      </div>
    </section>
  `;
};

const sidebarTemplate = (content) => `
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Resume</title>
    <style>
      @page { size: A4; margin: 0; }
      html, body { margin: 0; padding: 0; background: #edf2f7; color: #1f2937; font-family: Inter, Helvetica, Arial, sans-serif; }
      body { padding: 18mm; -webkit-print-color-adjust: exact; }
      .page { width: calc(210mm - 36mm); min-height: calc(297mm - 36mm); background: #ffffff; box-sizing: border-box; display: grid; grid-template-columns: 34% 66%; gap: 22px; padding: 20px; }
      .sidebar { background: #111827; color: #f8fafc; padding: 20px; display: flex; flex-direction: column; gap: 22px; }
      .sidebar h1 { margin: 0 0 12px; font-size: 24px; line-height: 1.05; letter-spacing: 0.05em; text-transform: uppercase; }
      .sidebar p { margin: 0; font-size: 11.8px; line-height: 1.75; color: #d1d5db; }
      .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
      .section-header h2 { margin: 0; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #93c5fd; }
      .section-body { display: grid; gap: 10px; }
      .skill-pill { display: inline-flex; align-items: center; justify-content: center; padding: 6px 10px; border-radius: 999px; background: rgba(255,255,255,0.1); color: #f8fafc; font-size: 10px; line-height: 1.4; }
      .sidebar p.item-details { margin: 0; font-size: 11.2px; line-height: 1.75; color: #d1d5db; }
      .main { display: flex; flex-direction: column; gap: 24px; }
      .section { break-inside: avoid-page; page-break-inside: avoid; }
      .section h2 { margin: 0 0 14px; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
      .section-body { display: grid; gap: 14px; }
      .item-card { padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; }
      .item-card:last-child { border-bottom: none; }
      .item-title { margin: 0 0 8px; font-size: 12.8px; font-weight: 700; color: #111827; }
      .item-details { margin: 0 0 6px; font-size: 11.8px; line-height: 1.7; color: #475569; }
      .item-list { margin: 0; padding-left: 18px; color: #334155; font-size: 11.8px; line-height: 1.75; }
      .item-list li { margin-bottom: 6px; }
      .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px; }
      .page-break { display: none; }
    </style>
  </head>
  <body>
    <div class="page">
      <aside class="sidebar">
        <div>
          <h1>${escapeHtml(content.name || "YOUR NAME")}</h1>
          <p>${formatText(content.summary || "An ATS-friendly, premium resume built for recruiters and screeners.")}</p>
        </div>

        <div>
          <div class="section-header"><h2>Contact</h2></div>
          <div class="section-body">
            ${content.email ? `<p class="item-details">${escapeHtml(content.email)}</p>` : ""}
            ${content.phone ? `<p class="item-details">${escapeHtml(content.phone)}</p>` : ""}
            ${content.linkedin ? `<p class="item-details">${escapeHtml(content.linkedin)}</p>` : ""}
            ${content.github ? `<p class="item-details">${escapeHtml(content.github)}</p>` : ""}
          </div>
        </div>

        ${renderSkills(content.skills)}
        ${renderEducation(content.education)}
        ${renderCertifications(content.certifications)}
      </aside>

      <main class="main">
        <section class="section">
          <h2>Professional Summary</h2>
          <div class="section-body">
            <p class="item-details">${escapeHtml(content.summary || "Results-driven professional with measurable success in performance and leadership.")}</p>
          </div>
        </section>

        ${renderSection("Experience", content.experience)}
        ${renderSection("Projects", content.projects)}
        ${renderSection("Achievements", content.achievements)}
      </main>
    </div>
  </body>
</html>
`;

const modernTemplate = (content) => `
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Resume</title>
    <style>
      @page { size: A4; margin: 0; }
      html, body { margin: 0; padding: 0; background: #f3f4f6; color: #111827; font-family: Inter, Helvetica, Arial, sans-serif; }
      body { padding: 18mm; -webkit-print-color-adjust: exact; }
      .page { width: calc(210mm - 36mm); min-height: calc(297mm - 36mm); background: #ffffff; box-sizing: border-box; display: grid; gap: 20px; padding: 22px 24px; box-shadow: 0 0 0 1px rgba(15,23,42,0.08); }
      .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
      .title-group { max-width: 68%; }
      .eyebrow { margin: 0 0 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.22em; color: #4f46e5; }
      .name { margin: 0; font-size: 32px; line-height: 1.05; letter-spacing: 0.03em; }
      .tagline { margin: 10px 0 0; font-size: 12.5px; line-height: 1.75; color: #475569; }
      .contact-bar { display: flex; flex-wrap: wrap; gap: 10px; font-size: 11.2px; color: #475569; letter-spacing: 0.02em; }
      .body-grid { display: grid; grid-template-columns: 3fr 1fr; gap: 22px; }
      .main-col { display: grid; gap: 22px; }
      .sidebar-col { display: grid; gap: 20px; }
      .section { break-inside: avoid-page; page-break-inside: avoid; }
      .section h2 { margin: 0 0 12px; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
      .section-body { display: grid; gap: 14px; }
      .item-card { padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; }
      .item-card:last-child { border-bottom: none; }
      .item-title { margin: 0 0 6px; font-size: 12.8px; font-weight: 700; color: #111827; }
      .item-details { margin: 0; font-size: 12px; line-height: 1.7; color: #475569; }
      .item-list { margin: 0; padding-left: 18px; font-size: 11.9px; line-height: 1.7; color: #334155; }
      .item-list li { margin-bottom: 6px; }
      .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(95px, 1fr)); gap: 8px; }
      .skill-pill { display: inline-flex; align-items: center; justify-content: center; padding: 6px 10px; border-radius: 999px; background: #eef2ff; color: #4338ca; font-size: 10px; line-height: 1.4; }
      .page-break { display: none; }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <div class="title-group">
          <p class="eyebrow">Professional Resume</p>
          <h1 class="name">${escapeHtml(content.name || "YOUR NAME")}</h1>
          <p class="tagline">${formatText(content.summary || "A polished resume layout built for recruiters, hiring managers, and applicant tracking systems.")}</p>
        </div>
        <div class="contact-bar">
          ${renderNavbarContact(content)}
        </div>
      </div>

      <div class="body-grid">
        <div class="main-col">
          ${renderSection("Experience", content.experience)}
          ${renderSection("Projects", content.projects)}
          ${renderSection("Achievements", content.achievements)}
        </div>
        <aside class="sidebar-col">
          ${renderSkills(content.skills)}
          ${renderEducation(content.education)}
          ${renderCertifications(content.certifications)}
        </aside>
      </div>
    </div>
  </body>
</html>
`;

export const buildResumeHtml = (content, template) => {
  if (template === "sidebar") {
    return sidebarTemplate(content);
  }
  return modernTemplate(content);
};