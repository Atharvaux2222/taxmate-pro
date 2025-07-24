import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  userId: string;
  message: string;
  response: string;
  role: 'user' | 'assistant';
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  userId: { type: String, required: true, index: true },
  message: { type: String, required: true },
  response: { type: String, default: '' },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);