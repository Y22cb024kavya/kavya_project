import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract plain text from TXT, DOCX, or PDF files.
 * @param {File} file 
 * @returns {Promise<string>}
 */
export async function extractTextFromFile(file) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".txt")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result || "");
      reader.onerror = (e) => reject(new Error("Failed to read TXT file"));
      reader.readAsText(file);
    });
  }

  if (fileName.endsWith(".docx")) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || "";
  }

  if (fileName.endsWith(".pdf")) {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageItems = textContent.items.map((item) => item.str).join(" ");
      fullText += pageItems + "\n";
    }

    return fullText.trim();
  }

  throw new Error("Unsupported file format. Please upload PDF, DOCX, or TXT files.");
}

/**
 * Split text into searchable chunks with overlapping context.
 * @param {string} text 
 * @param {number} chunkSize 
 * @param {number} overlap 
 * @returns {Array<string>}
 */
export function chunkText(text, chunkSize = 400, overlap = 80) {
  if (!text || typeof text !== "string") return [];
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= chunkSize) return [clean];

  const chunks = [];
  let startIndex = 0;

  while (startIndex < clean.length) {
    let endIndex = startIndex + chunkSize;
    if (endIndex < clean.length) {
      // Find a sentence boundary or space near endIndex to keep sentences whole
      const lastPeriod = clean.lastIndexOf(".", endIndex);
      const lastSpace = clean.lastIndexOf(" ", endIndex);

      if (lastPeriod > startIndex + 100) {
        endIndex = lastPeriod + 1;
      } else if (lastSpace > startIndex + 100) {
        endIndex = lastSpace;
      }
    }

    const chunk = clean.slice(startIndex, endIndex).trim();
    if (chunk.length > 20) {
      chunks.push(chunk);
    }

    startIndex = endIndex - overlap;
    if (startIndex >= clean.length - overlap) break;
  }

  return chunks;
}
