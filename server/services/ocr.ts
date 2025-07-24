import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(imagePath: string): Promise<string> {
  try {
    const worker = await createWorker('eng');
    
    const { data: { text } } = await worker.recognize(imagePath);
    
    await worker.terminate();
    
    return text;
  } catch (error) {
    throw new Error("Failed to extract text from image: " + (error as Error).message);
  }
}

export async function extractTextFromPDF(pdfPath: string): Promise<string> {
  // For PDF OCR, we'd typically use a library like pdf-poppler to convert to images first
  // Then process with Tesseract. For now, we'll return a placeholder implementation
  try {
    // TODO: Implement PDF to image conversion and OCR processing
    // This would require additional packages like pdf-poppler or pdf2pic
    throw new Error("PDF OCR not implemented yet. Please upload images for now.");
  } catch (error) {
    throw new Error("Failed to extract text from PDF: " + (error as Error).message);
  }
}

export async function processFileForOCR(filePath: string, fileType: string): Promise<string> {
  if (fileType.startsWith('image/')) {
    return await extractTextFromImage(filePath);
  } else if (fileType === 'application/pdf') {
    return await extractTextFromPDF(filePath);
  } else {
    throw new Error("Unsupported file type for OCR processing");
  }
}
