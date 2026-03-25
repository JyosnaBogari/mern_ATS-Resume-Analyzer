import pdfParse from "pdf-parse/lib/pdf-parse.js"; // ✅ force correct path

export const extractTextFromBuffer = async (buffer) => {
  try {
    if (!buffer) {
      throw new Error("No file buffer provided");
    }

    const data = await pdfParse(buffer);

    return data.text || "";
  } catch (error) {
    console.error("Extraction Error:", error.message);
    throw new Error("Failed to extract text from PDF");
  }
};