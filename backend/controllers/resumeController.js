import PDFDocument from 'pdfkit';
import { generateModernTemplate } from '../utils/templates/modernTemplate.js';
import { generateSidebarTemplate } from '../utils/templates/sidebarTemplate.js';

export const generateResume = async (
  req,
  res
) => {

  try {

    const data = req.body;

    const doc =
      new PDFDocument({
        margin: 40,
        size: 'A4'
      });

    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=resume.pdf'
    );

    doc.pipe(res);

    const content = {
      name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'YOUR NAME',
      email: data.email || '',
      phone: data.phone || '',
      summary: data.summary || '',
      skills: Array.isArray(data.skills)
        ? data.skills
        : typeof data.skills === 'string'
        ? data.skills.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
      education: Array.isArray(data.education)
        ? data.education
        : [],
      experience: Array.isArray(data.experience)
        ? data.experience
        : [],
      projects: Array.isArray(data.projects)
        ? data.projects
        : [],
      certifications: Array.isArray(data.certifications)
        ? data.certifications
        : []
    };

    if (
      data.template === 'sidebar' ||
      data.template === 'template2'
    ) {
      generateSidebarTemplate(doc, content);
    } else {
      generateModernTemplate(doc, content);
    }

    doc.end();

  } catch (error) {

    console.log(error);

    res.status(500).send({
      message:
        'Resume generation failed'
    });
  }
};