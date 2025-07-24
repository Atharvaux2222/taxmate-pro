import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage-mongodb";
import { setupAuth, isAuthenticated } from "./replitAuth";
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
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tax filing routes
  app.get('/api/tax-filings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const filings = await storage.getUserTaxFilings(userId);
      res.json(filings);
    } catch (error) {
      console.error("Error fetching tax filings:", error);
      res.status(500).json({ message: "Failed to fetch tax filings" });
    }
  });

  app.post('/api/tax-filings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get('/api/tax-filings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const filingId = parseInt(req.params.id);
      
      const filing = await storage.getTaxFiling(filingId);
      if (!filing || filing.userId !== userId) {
        return res.status(404).json({ message: "Tax filing not found" });
      }
      
      res.json(filing);
    } catch (error) {
      console.error("Error fetching tax filing:", error);
      res.status(500).json({ message: "Failed to fetch tax filing" });
    }
  });

  // File upload and OCR processing
  app.post('/api/upload-form16', isAuthenticated, upload.single('form16'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.claims.sub;
      const file = req.file;

      // Save file upload record
      const fileUpload = await storage.createFileUpload({
        userId,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: file.path,
        status: 'processing'
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
            status: 'processing',
            form16Data: req.file,
            extractedData
          });
        } else {
          taxFiling = await storage.updateTaxFiling(taxFiling.id, {
            extractedData,
            status: 'processing'
          });
        }

        // Generate tax suggestions
        const suggestions = await generateTaxSuggestions(extractedData);
        await storage.updateTaxFiling(taxFiling.id, {
          taxSuggestions: suggestions,
          status: 'completed'
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
  app.get('/api/chat/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getUserChatMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/chat/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Save user message
      const userMessage = await storage.createChatMessage({
        userId,
        message,
        isBot: false
      });

      // Generate bot response
      const botResponse = await generateChatbotResponse(message);
      
      // Save bot response
      const botMessage = await storage.createChatMessage({
        userId,
        message: botResponse,
        isBot: true
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
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
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
          case 'processing':
            stats.progress = 75;
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
