import mongoose, { Schema, Document } from 'mongoose';

export interface IFileUpload extends Document {
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadPath: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  ocrText?: string;
  processedData?: any;
  createdAt: Date;
  updatedAt: Date;
}

const FileUploadSchema = new Schema<IFileUpload>({
  userId: { type: String, required: true, index: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadPath: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['uploaded', 'processing', 'completed', 'failed'], 
    default: 'uploaded' 
  },
  ocrText: String,
  processedData: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const FileUpload = mongoose.model<IFileUpload>('FileUpload', FileUploadSchema);