import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import axios from 'axios';

export const extractTextFromURL = async (url) => {
  try {
    // 1. Download the PDF
    const response = await axios.get(url, { 
        responseType: 'arraybuffer',
        timeout: 10000 
    });

    // 2. CRITICAL: Convert Axios response to a Node.js Buffer
    const buffer = Buffer.from(response.data);

    // 3. Parse the PDF
    // We pass the buffer directly here
    const data = await pdf(buffer);
    
    // 4. Check if text exists
    if (!data || !data.text) {
        return "No readable text found in this PDF file.";
    }

    // 5. Clean the text
    const cleanText = data.text.replace(/\s+/g, ' ').trim();
    
    return cleanText;
  } catch (error) {
    // Log detailed error to terminal
    console.error("--- Extraction Debug Start ---");
    console.error("Message:", error.message);
    if (error.response) console.error("Axios Status:", error.response.status);
    console.error("--- Extraction Debug End ---");

    throw new Error(`PDF Parsing failed: ${error.message}`);
  }
};