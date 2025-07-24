import mongoose, { Schema, Document } from 'mongoose';

export interface ITaxFiling extends Document {
  userId: string;
  financialYear: string;
  employeeName: string;
  pan: string;
  employerName: string;
  grossSalary: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  deductions80C: number;
  deductions80D: number;
  standardDeduction: number;
  tdsDeducted: number;
  taxPayable: number;
  status: 'draft' | 'completed' | 'filed';
  extractedData?: any;
  taxSuggestions?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const TaxFilingSchema = new Schema<ITaxFiling>({
  userId: { type: String, required: true, index: true },
  financialYear: { type: String, required: true },
  employeeName: { type: String, default: '' },
  pan: { type: String, default: '' },
  employerName: { type: String, default: '' },
  grossSalary: { type: Number, default: 0 },
  basicSalary: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  specialAllowance: { type: Number, default: 0 },
  deductions80C: { type: Number, default: 0 },
  deductions80D: { type: Number, default: 0 },
  standardDeduction: { type: Number, default: 0 },
  tdsDeducted: { type: Number, default: 0 },
  taxPayable: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'completed', 'filed'], default: 'draft' },
  extractedData: Schema.Types.Mixed,
  taxSuggestions: [Schema.Types.Mixed],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TaxFilingSchema.index({ userId: 1, financialYear: 1 }, { unique: true });

export const TaxFiling = mongoose.model<ITaxFiling>('TaxFiling', TaxFilingSchema);