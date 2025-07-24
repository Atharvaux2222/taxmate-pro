import {
  users,
  taxFilings,
  chatMessages,
  fileUploads,
  type User,
  type UpsertUser,
  type TaxFiling,
  type InsertTaxFiling,
  type ChatMessage,
  type InsertChatMessage,
  type FileUpload,
  type InsertFileUpload,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Tax filing operations
  getUserTaxFilings(userId: string): Promise<TaxFiling[]>;
  getUserTaxFilingByYear(userId: string, financialYear: string): Promise<TaxFiling | undefined>;
  getTaxFiling(id: string): Promise<TaxFiling | undefined>;
  createTaxFiling(taxFiling: InsertTaxFiling): Promise<TaxFiling>;
  updateTaxFiling(id: number, updates: Partial<InsertTaxFiling>): Promise<TaxFiling>;
  
  // Chat operations
  getUserChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // File upload operations
  createFileUpload(fileUpload: InsertFileUpload): Promise<FileUpload>;
  updateFileUpload(id: number, updates: Partial<InsertFileUpload>): Promise<FileUpload>;
}

class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Tax filing operations
  async getUserTaxFilings(userId: string): Promise<TaxFiling[]> {
    return await db.select().from(taxFilings).where(eq(taxFilings.userId, userId));
  }

  async getUserTaxFilingByYear(userId: string, financialYear: string): Promise<TaxFiling | undefined> {
    const [filing] = await db
      .select()
      .from(taxFilings)
      .where(and(eq(taxFilings.userId, userId), eq(taxFilings.financialYear, financialYear)));
    return filing;
  }

  async getTaxFiling(id: string): Promise<TaxFiling | undefined> {
    const [filing] = await db.select().from(taxFilings).where(eq(taxFilings.id, parseInt(id)));
    return filing;
  }

  async createTaxFiling(taxFiling: InsertTaxFiling): Promise<TaxFiling> {
    const [filing] = await db
      .insert(taxFilings)
      .values(taxFiling)
      .returning();
    return filing;
  }

  async updateTaxFiling(id: number, updates: Partial<InsertTaxFiling>): Promise<TaxFiling> {
    const [filing] = await db
      .update(taxFilings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(taxFilings.id, id))
      .returning();
    return filing;
  }

  // Chat operations
  async getUserChatMessages(userId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.userId, userId));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return chatMessage;
  }

  // File upload operations
  async createFileUpload(fileUpload: InsertFileUpload): Promise<FileUpload> {
    const [upload] = await db
      .insert(fileUploads)
      .values(fileUpload)
      .returning();
    return upload;
  }

  async updateFileUpload(id: number, updates: Partial<InsertFileUpload>): Promise<FileUpload> {
    const [upload] = await db
      .update(fileUploads)
      .set(updates)
      .where(eq(fileUploads.id, id))
      .returning();
    return upload;
  }
}

export const storage = new DatabaseStorage();