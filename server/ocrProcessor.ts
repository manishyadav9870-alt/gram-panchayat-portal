import tesseract from "node-tesseract-ocr";
import { fromPath } from "pdf2pic";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * OCR Configuration for Marathi language processing
 */
const OCR_CONFIG = {
  lang: "mar+eng", // Marathi + English
  oem: 1, // LSTM OCR Engine Mode
  psm: 3, // Fully automatic page segmentation
};

/**
 * PDF to Image conversion configuration
 */
const PDF_TO_IMAGE_CONFIG = {
  density: 300, // DPI - higher = better quality
  saveFilename: "page",
  savePath: os.tmpdir(),
  format: "png",
  width: 2480, // A4 at 300 DPI
  height: 3508,
};

/**
 * Interface for OCR result
 */
export interface OCRResult {
  text: string;
  pageNumber: number;
  confidence?: number;
}

/**
 * Interface for complete PDF OCR result
 */
export interface PDFOCRResult {
  success: boolean;
  totalPages: number;
  extractedText: string;
  pages: OCRResult[];
  error?: string;
}

/**
 * Extract text from a single image using Tesseract OCR
 * @param imagePath - Path to the image file
 * @returns Extracted text
 */
async function extractTextFromImage(imagePath: string): Promise<string> {
  try {
    const text = await tesseract.recognize(imagePath, OCR_CONFIG);
    return text.trim();
  } catch (error) {
    console.error(`Error extracting text from image: ${imagePath}`, error);
    throw error;
  }
}

/**
 * Convert PDF to images and extract text using OCR
 * @param pdfPath - Path to the PDF file
 * @returns OCR result with extracted text from all pages
 */
export async function extractTextFromPDF(pdfPath: string): Promise<PDFOCRResult> {
  const tempImages: string[] = [];
  
  try {
    // Validate PDF file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found: ${pdfPath}`);
    }

    // Convert PDF to images
    const convert = fromPath(pdfPath, PDF_TO_IMAGE_CONFIG);
    
    // Get PDF page count (we'll try to convert all pages)
    const pages: OCRResult[] = [];
    let pageNumber = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const pageResult = await convert(pageNumber, { responseType: "image" });
        
        if (pageResult && pageResult.path) {
          tempImages.push(pageResult.path);
          
          // Extract text from the image
          const text = await extractTextFromImage(pageResult.path);
          
          pages.push({
            text,
            pageNumber,
          });
          
          pageNumber++;
        } else {
          hasMorePages = false;
        }
      } catch (error) {
        // No more pages
        hasMorePages = false;
      }
    }

    // Combine all page texts
    const extractedText = pages.map(p => p.text).join("\n\n");

    return {
      success: true,
      totalPages: pages.length,
      extractedText,
      pages,
    };
  } catch (error: any) {
    console.error("Error processing PDF with OCR:", error);
    return {
      success: false,
      totalPages: 0,
      extractedText: "",
      pages: [],
      error: error.message || "Failed to process PDF",
    };
  } finally {
    // Clean up temporary image files
    tempImages.forEach((imagePath) => {
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (error) {
        console.error(`Failed to delete temp file: ${imagePath}`, error);
      }
    });
  }
}

/**
 * Extract specific fields from Marathi birth certificate
 * @param text - Extracted text from OCR
 * @returns Parsed certificate data
 */
export function parseBirthCertificate(text: string): Record<string, string> {
  const data: Record<string, string> = {};
  
  // Common patterns in Marathi birth certificates
  const patterns = {
    certificateNo: /प्रमाणपत्र क्र[\.\/]?\s*[:\/]?\s*([^\n]+)/i,
    name: /नाव\s*[:\/]?\s*([^\n]+)/i,
    nameOfChild: /Name of Child\s*[:\/]?\s*([^\n]+)/i,
    sex: /लिंग\s*[:\/]?\s*([^\n]+)/i,
    dateOfBirth: /जन्म तारीख\s*[:\/]?\s*([^\n]+)/i,
    placeOfBirth: /जन्म स्थळ\s*[:\/]?\s*([^\n]+)/i,
    motherName: /आईचे पूर्ण नाव\s*[:\/]?\s*([^\n]+)/i,
    fatherName: /वडिलांचे पूर्ण नाव\s*[:\/]?\s*([^\n]+)/i,
    address: /पत्ता\s*[:\/]?\s*([^\n]+)/i,
    registrationNo: /नोंदणी क्रमांक\s*[:\/]?\s*([^\n]+)/i,
    registrationDate: /नोंदणी दिनांक\s*[:\/]?\s*([^\n]+)/i,
  };

  // Extract data using patterns
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data[key] = match[1].trim();
    }
  }

  return data;
}

/**
 * Extract text from uploaded PDF buffer
 * @param buffer - PDF file buffer
 * @param originalFilename - Original filename
 * @returns OCR result
 */
export async function extractTextFromPDFBuffer(
  buffer: Buffer,
  originalFilename: string
): Promise<PDFOCRResult> {
  const tempPdfPath = path.join(os.tmpdir(), `temp-${Date.now()}-${originalFilename}`);
  
  try {
    // Write buffer to temporary file
    fs.writeFileSync(tempPdfPath, buffer);
    
    // Process the PDF
    const result = await extractTextFromPDF(tempPdfPath);
    
    return result;
  } catch (error: any) {
    console.error("Error processing PDF buffer:", error);
    return {
      success: false,
      totalPages: 0,
      extractedText: "",
      pages: [],
      error: error.message || "Failed to process PDF buffer",
    };
  } finally {
    // Clean up temporary PDF file
    try {
      if (fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
      }
    } catch (error) {
      console.error(`Failed to delete temp PDF: ${tempPdfPath}`, error);
    }
  }
}
