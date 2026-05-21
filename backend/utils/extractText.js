import pdfParse from "pdf-parse/lib/pdf-parse.js"; // ✅ force correct path
import mammoth from "mammoth";

export const extractTextFromBuffer = async (buffer, mimetype) => {
  try {
    if (!buffer) {
      throw new Error("No file buffer provided");
    }

    if (mimetype === "application/pdf") {
      const data = await pdfParse(buffer);
      return data.text || "";
    } else if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }
    throw new Error("Unsupported file format");
  } catch (error) {
    console.error("Extraction Error:", error.message);
    throw new Error("Failed to extract text from PDF");
  }
};