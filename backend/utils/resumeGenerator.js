import PDFDocument from "pdfkit";
import { parseResume } from "./parseResume.js";

import { generateModernTemplate } from "./templates/modernTemplate.js";
import { generateSidebarTemplate } from "./templates/sidebarTemplate.js";

/* =======================================================
   MAIN EXPORT
======================================================= */

export const generateImprovedResume =
  async (resume, res) => {

    try {

      const doc =
        new PDFDocument({
          margin: 40,
          size: "A4"
        });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="resume.pdf"`
      );

      // IMPORTANT
      doc.pipe(res);

      const parsedContent =
        parseResume(
          resume.improvedResume || ""
        );

      // TEMPLATE SWITCH
      if (
        resume.template === "sidebar"
      ) {

        generateSidebarTemplate(
          doc,
          parsedContent
        );

      } else {

        generateModernTemplate(
          doc,
          parsedContent
        );
      }

      // IMPORTANT
      doc.end();

    } catch (err) {

      console.log(
        "PDF ERROR:",
        err
      );

      if (!res.headersSent) {

        res.status(500).json({
          message:
            "Failed to generate PDF"
        });
      }
    }
};