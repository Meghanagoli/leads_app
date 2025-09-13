import { z } from 'zod';

// Enum values
export const cityOptions = ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'] as const;
export const propertyTypeOptions = ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'] as const;
export const bhkOptions = ['1', '2', '3', '4', 'Studio'] as const;
export const purposeOptions = ['Buy', 'Rent'] as const;
export const timelineOptions = ['0-3m', '3-6m', '>6m', 'Exploring'] as const;
export const sourceOptions = ['Website', 'Referral', 'Walk-in', 'Call', 'Other'] as const;
export const statusOptions = ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'] as const;

// Base buyer schema
export const buyerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80, 'Full name must be at most 80 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  city: z.enum(cityOptions),
  propertyType: z.enum(propertyTypeOptions),
  bhk: z.enum(bhkOptions).optional(),
  purpose: z.enum(purposeOptions),
  budgetMin: z.number().int().min(0, 'Budget must be positive').optional(),
  budgetMax: z.number().int().min(0, 'Budget must be positive').optional(),
  timeline: z.enum(timelineOptions),
  source: z.enum(sourceOptions),
  status: z.enum(statusOptions).default('New'),
  notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional(),
  tags: z.array(z.string()).optional(),
}).refine((data) => {
  // BHK is required for Apartment and Villa
  if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa',
  path: ['bhk'],
}).refine((data) => {
  // Budget max must be >= budget min if both are present
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax'],
});

// Schema for creating a new buyer
export const createBuyerSchema = buyerSchema;

// Schema for updating a buyer
export const updateBuyerSchema = buyerSchema.partial().extend({
  id: z.string().uuid(),
  updatedAt: z.date(),
});

// Schema for CSV import
export const csvBuyerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().transform((val) => {
    // Handle scientific notation and formatting
    if (val.includes('E+') || val.includes('e+')) {
      const num = parseFloat(val);
      return Math.round(num).toString();
    }
    // Remove any non-digit characters
    return val.replace(/\D/g, '');
  }).refine((val) => /^\d{10,15}$/.test(val), 'Phone must be 10-15 digits'),
  city: z.enum(cityOptions),
  propertyType: z.enum(propertyTypeOptions),
  bhk: z.enum(bhkOptions).optional().or(z.literal('')),
  purpose: z.enum(purposeOptions),
  budgetMin: z.string().transform((val) => val ? parseInt(val) : undefined).optional(),
  budgetMax: z.string().transform((val) => val ? parseInt(val) : undefined).optional(),
  timeline: z.enum(timelineOptions),
  source: z.enum(sourceOptions),
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.string().optional().transform((val) => val ? val.split(',').map(tag => tag.trim()) : []),
  status: z.enum(statusOptions).default('New'),
}).refine((data) => {
  if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa',
  path: ['bhk'],
}).refine((data) => {
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax'],
});

// Types
export type BuyerFormData = z.infer<typeof buyerSchema>;
export type CreateBuyerData = z.infer<typeof createBuyerSchema>;
export type UpdateBuyerData = z.infer<typeof updateBuyerSchema>;
export type CsvBuyerData = z.infer<typeof csvBuyerSchema>;
