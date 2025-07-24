import { User, IUser } from './models/User';
import { TaxFiling, ITaxFiling } from './models/TaxFiling';
import { ChatMessage, IChatMessage } from './models/ChatMessage';
import { FileUpload, IFileUpload } from './models/FileUpload';

// Types for compatibility with existing code
export interface UpsertUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export interface InsertTaxFiling {
  userId: string;
  financialYear: string;
  employeeName?: string;
  pan?: string;
  employerName?: string;
  grossSalary?: number;
  basicSalary?: number;
  hra?: number;
  specialAllowance?: number;
  deductions80C?: number;
  deductions80D?: number;
  standardDeduction?: number;
  tdsDeducted?: number;
  taxPayable?: number;
  status?: 'draft' | 'completed' | 'filed';
  extractedData?: any;
  taxSuggestions?: any[];
}

export interface InsertChatMessage {
  userId: string;
  message: string;
  response?: string;
  role: 'user' | 'assistant';
}

export interface InsertFileUpload {
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadPath: string;
  status?: 'uploaded' | 'processing' | 'completed' | 'failed';
  ocrText?: string;
  processedData?: any;
}

// Interface for storage operations
export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<IUser | undefined>;
  upsertUser(user: UpsertUser): Promise<IUser>;
  
  // Tax filing operations
  getUserTaxFilings(userId: string): Promise<ITaxFiling[]>;
  getUserTaxFilingByYear(userId: string, financialYear: string): Promise<ITaxFiling | undefined>;
  getTaxFiling(id: string): Promise<ITaxFiling | undefined>;
  createTaxFiling(taxFiling: InsertTaxFiling): Promise<ITaxFiling>;
  updateTaxFiling(id: string, updates: Partial<InsertTaxFiling>): Promise<ITaxFiling>;
  
  // Chat operations
  getUserChatMessages(userId: string): Promise<IChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<IChatMessage>;
  
  // File upload operations
  createFileUpload(fileUpload: InsertFileUpload): Promise<IFileUpload>;
  updateFileUpload(id: string, updates: Partial<InsertFileUpload>): Promise<IFileUpload>;
}

export class MongoDBStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<IUser | undefined> {
    const user = await User.findOne({ id });
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<IUser> {
    const user = await User.findOneAndUpdate(
      { id: userData.id },
      { 
        ...userData,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );
    return user;
  }

  // Tax filing operations
  async getUserTaxFilings(userId: string): Promise<ITaxFiling[]> {
    return await TaxFiling.find({ userId }).sort({ createdAt: -1 });
  }

  async getUserTaxFilingByYear(userId: string, financialYear: string): Promise<ITaxFiling | undefined> {
    const filing = await TaxFiling.findOne({ userId, financialYear });
    return filing || undefined;
  }

  async getTaxFiling(id: string): Promise<ITaxFiling | undefined> {
    const filing = await TaxFiling.findById(id);
    return filing || undefined;
  }

  async createTaxFiling(taxFiling: InsertTaxFiling): Promise<ITaxFiling> {
    const filing = new TaxFiling(taxFiling);
    return await filing.save();
  }

  async updateTaxFiling(id: string, updates: Partial<InsertTaxFiling>): Promise<ITaxFiling> {
    const filing = await TaxFiling.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    if (!filing) {
      throw new Error('Tax filing not found');
    }
    return filing;
  }

  // Chat operations
  async getUserChatMessages(userId: string): Promise<IChatMessage[]> {
    return await ChatMessage.find({ userId }).sort({ createdAt: 1 });
  }

  async createChatMessage(message: InsertChatMessage): Promise<IChatMessage> {
    const chatMessage = new ChatMessage(message);
    return await chatMessage.save();
  }

  // File upload operations
  async createFileUpload(fileUpload: InsertFileUpload): Promise<IFileUpload> {
    const upload = new FileUpload(fileUpload);
    return await upload.save();
  }

  async updateFileUpload(id: string, updates: Partial<InsertFileUpload>): Promise<IFileUpload> {
    const upload = await FileUpload.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    if (!upload) {
      throw new Error('File upload not found');
    }
    return upload;
  }
}

export const storage = new MongoDBStorage();