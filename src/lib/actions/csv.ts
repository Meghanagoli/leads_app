'use server';

import { db, buyers, buyerHistory } from '@/lib/db';
import { csvBuyerSchema } from '@/lib/validations/buyer';
import { eq, and, desc, like, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface CsvImportResult {
  success: boolean;
  imported: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}

export async function importCsv(csvData: string, userId: string): Promise<CsvImportResult> {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  // Expected headers
  const expectedHeaders = [
    'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk', 'purpose',
    'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status'
  ];
  
  // Validate headers
  if (!expectedHeaders.every(header => headers.includes(header))) {
    return {
      success: false,
      imported: 0,
      errors: [{
        row: 0,
        message: 'Invalid CSV headers. Expected: ' + expectedHeaders.join(', ')
      }]
    };
  }

  const errors: Array<{ row: number; message: string }> = [];
  const validRows: any[] = [];
  
  // Process each row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    
    if (values.length !== headers.length) {
      errors.push({
        row: i + 1,
        message: `Expected ${headers.length} columns, got ${values.length}`
      });
      continue;
    }
    
    // Create object from row data
    const rowData: any = {};
    headers.forEach((header, index) => {
      rowData[header] = values[index] || '';
    });
    
    // Validate row data
    try {
      const validatedData = csvBuyerSchema.parse(rowData);
      validRows.push(validatedData);
    } catch (error: any) {
      // Get more detailed error information
      const errorMessages = error.errors?.map((err: any) => {
        const field = err.path?.join('.') || 'unknown field';
        return `${field}: ${err.message}`;
      }).join(', ') || 'Validation error';
      
      errors.push({
        row: i + 1,
        message: errorMessages
      });
    }
  }
  
  // Check if we have too many rows
  if (validRows.length > 200) {
    return {
      success: false,
      imported: 0,
      errors: [{
        row: 0,
        message: 'Maximum 200 rows allowed for import'
      }]
    };
  }
  
  // Import valid rows in a transaction
  let imported = 0;
  try {
    for (const rowData of validRows) {
      const [newBuyer] = await db.insert(buyers).values({
        fullName: rowData.fullName,
        email: rowData.email || null,
        phone: rowData.phone,
        city: rowData.city,
        propertyType: rowData.propertyType,
        bhk: rowData.bhk || null,
        purpose: rowData.purpose,
        budgetMin: rowData.budgetMin || null,
        budgetMax: rowData.budgetMax || null,
        timeline: rowData.timeline,
        source: rowData.source,
        status: rowData.status,
        notes: rowData.notes || null,
        tags: rowData.tags?.length ? rowData.tags : null,
        ownerId: userId,
      }).returning();
      
      // Create history entry
      await db.insert(buyerHistory).values({
        buyerId: newBuyer.id,
        changedBy: userId,
        changedAt: new Date(),
        diff: {
          created: { old: null, new: 'Lead imported from CSV' }
        }
      });
      
      imported++;
    }
    
    revalidatePath('/buyers');
    
    return {
      success: true,
      imported,
      errors
    };
  } catch (error) {
    return {
      success: false,
      imported: 0,
      errors: [{
        row: 0,
        message: 'Database error during import'
      }]
    };
  }
}

export async function exportCsv(filters: {
  search?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
}): Promise<string> {
  // Build where conditions (same as getBuyers)
  const conditions = [];
  
  if (filters.search) {
    conditions.push(
      or(
        like(buyers.fullName, `%${filters.search}%`),
        like(buyers.phone, `%${filters.search}%`),
        like(buyers.email, `%${filters.search}%`)
      )
    );
  }
  
  if (filters.city) {
    conditions.push(eq(buyers.city, filters.city as any));
  }
  
  if (filters.propertyType) {
    conditions.push(eq(buyers.propertyType, filters.propertyType as any));
  }
  
  if (filters.status) {
    conditions.push(eq(buyers.status, filters.status as any));
  }
  
  if (filters.timeline) {
    conditions.push(eq(buyers.timeline, filters.timeline as any));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get all buyers matching filters
  const buyersList = await db
    .select()
    .from(buyers)
    .where(whereClause)
    .orderBy(desc(buyers.updatedAt));

  // Create CSV content
  const headers = [
    'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk', 'purpose',
    'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status',
    'createdAt', 'updatedAt'
  ];
  
  const csvRows = [headers.join(',')];
  
  buyersList.forEach(buyer => {
    const row = [
      `"${buyer.fullName}"`,
      `"${buyer.email || ''}"`,
      `"${buyer.phone}"`,
      `"${buyer.city}"`,
      `"${buyer.propertyType}"`,
      `"${buyer.bhk || ''}"`,
      `"${buyer.purpose}"`,
      buyer.budgetMin || '',
      buyer.budgetMax || '',
      `"${buyer.timeline}"`,
      `"${buyer.source}"`,
      `"${buyer.notes || ''}"`,
      `"${buyer.tags?.join(',') || ''}"`,
      `"${buyer.status}"`,
      buyer.createdAt.toISOString(),
      buyer.updatedAt.toISOString()
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
}
