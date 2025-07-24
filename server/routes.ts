import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";

import { extractForm16Data, generateTaxSuggestions, generateChatbotResponse } from "./services/gemini";
import { processFileForOCR } from "./services/ocr";
import { insertTaxFilingSchema, insertChatMessageSchema, insertFileUploadSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Tax filing routes
  app.get('/api/tax-filings', async (req: any, res) => {
    try {
      // For now, return empty array since we removed authentication
      res.json([]);
    } catch (error) {
      console.error("Error fetching tax filings:", error);
      res.status(500).json({ message: "Failed to fetch tax filings" });
    }
  });

  app.post('/api/tax-filings', async (req: any, res) => {
    try {
      // For demo purposes, use a default user ID
      const userId = "demo_user";
      const filingData = insertTaxFilingSchema.parse({
        ...req.body,
        userId
      });
      
      const filing = await storage.createTaxFiling(filingData);
      res.json(filing);
    } catch (error) {
      console.error("Error creating tax filing:", error);
      res.status(500).json({ message: "Failed to create tax filing" });
    }
  });

  app.get('/api/tax-filings/:id', async (req: any, res) => {
    try {
      const filingId = req.params.id;
      const filing = await storage.getTaxFiling(filingId);
      
      if (!filing) {
        return res.status(404).json({ message: "Tax filing not found" });
      }
      
      res.json(filing);
    } catch (error) {
      console.error("Error fetching tax filing:", error);
      res.status(500).json({ message: "Failed to fetch tax filing" });
    }
  });

  // File upload and OCR processing
  app.post('/api/upload-form16', upload.single('form16'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = "demo_user";
      const file = req.file;

      // Save file upload record
      const fileUpload = await storage.createFileUpload({
        userId,
        filename: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: file.path,
        status: 'processing' as const
      });

      // Process OCR in background
      try {
        const ocrText = await processFileForOCR(file.path, file.mimetype);
        const extractedData = await extractForm16Data(ocrText);
        
        // Update file upload with OCR text
        await storage.updateFileUpload(fileUpload.id, {
          ocrText,
          status: 'completed'
        });

        // Create or update tax filing
        const currentYear = '2023-24';
        let taxFiling = await storage.getUserTaxFilingByYear(userId, currentYear);
        
        if (!taxFiling) {
          taxFiling = await storage.createTaxFiling({
            userId,
            financialYear: currentYear,
            status: 'draft' as const,
            form16Data: req.file,
            extractedData
          });
        } else {
          taxFiling = await storage.updateTaxFiling(taxFiling.id, {
            extractedData,
            status: 'draft' as const
          });
        }

        // Generate tax suggestions
        const suggestions = await generateTaxSuggestions(extractedData);
        await storage.updateTaxFiling(taxFiling.id, {
          taxSuggestions: suggestions,
          status: 'completed' as const
        });

        res.json({
          success: true,
          fileUpload,
          taxFiling,
          extractedData,
          suggestions
        });

      } catch (processingError) {
        await storage.updateFileUpload(fileUpload.id, {
          status: 'failed'
        });
        throw processingError;
      }

    } catch (error) {
      console.error("Error processing form16 upload:", error);
      res.status(500).json({ message: "Failed to process file upload" });
    }
  });

  // Chat routes
  app.get('/api/chat/messages', async (req: any, res) => {
    try {
      const userId = "demo_user";
      const messages = await storage.getUserChatMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/chat/messages', async (req: any, res) => {
    try {
      const userId = "demo_user";
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Save user message
      const userMessage = await storage.createChatMessage({
        userId,
        message,
        role: 'user' as const
      });

      // Generate bot response
      const botResponse = await generateChatbotResponse(message);
      
      // Save bot response
      const botMessage = await storage.createChatMessage({
        userId,
        message: botResponse,
        role: 'assistant' as const
      });

      res.json({
        userMessage,
        botMessage
      });

    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', async (req: any, res) => {
    try {
      const userId = "demo_user";
      
      const currentFiling = await storage.getUserTaxFilingByYear(userId, '2023-24');
      let stats = {
        hasCurrentFiling: !!currentFiling,
        filingStatus: currentFiling?.status || 'not_started',
        potentialSavings: 0,
        estimatedRefund: 0,
        progress: 0
      };

      if (currentFiling && currentFiling.taxSuggestions) {
        const suggestions = currentFiling.taxSuggestions as any[];
        stats.potentialSavings = suggestions.reduce((total, suggestion) => 
          total + (suggestion.potentialSaving || 0), 0
        );
        
        // Calculate progress based on status
        switch (currentFiling.status) {
          case 'draft':
            stats.progress = 25;
            break;

          case 'completed':
            stats.progress = 100;
            break;
          default:
            stats.progress = 0;
        }
      }

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
