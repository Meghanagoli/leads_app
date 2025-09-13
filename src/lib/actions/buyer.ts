'use server';

import { db, buyers, buyerHistory } from '@/lib/db';
import { createBuyerSchema, CreateBuyerData } from '@/lib/validations/buyer';
import { eq, and, desc, asc, like, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createBuyer(data: CreateBuyerData, ownerId: string) {
  // Validate the data
  const validatedData = createBuyerSchema.parse(data);
  
  // Process tags
  const tags = validatedData.tags?.length ? validatedData.tags : undefined;
  
  // Create the buyer
  const [newBuyer] = await db.insert(buyers).values({
    ...validatedData,
    tags,
    ownerId,
  }).returning();

  // Create history entry with unique timestamp
  // Use microsecond precision to ensure uniqueness
  const now = Date.now();
  const timestamp = new Date(now + Math.floor(Math.random() * 1000));
  await db.insert(buyerHistory).values({
    buyerId: newBuyer.id,
    changedBy: ownerId,
    changedAt: timestamp,
    diff: {
      created: { old: null, new: 'Lead created' }
    }
  });

  revalidatePath('/buyers');
  return newBuyer;
}

export async function updateBuyer(id: string, data: Partial<CreateBuyerData & { updatedAt?: Date }>, userId: string) {
  // Get the current buyer to check ownership and get current values
  const [currentBuyer] = await db.select().from(buyers).where(eq(buyers.id, id)).limit(1);
  
  if (!currentBuyer) {
    throw new Error('Buyer not found');
  }

  if (currentBuyer.ownerId !== userId) {
    throw new Error('Unauthorized: You can only edit your own leads');
  }

  // Check for concurrency conflicts (only if updatedAt is provided)
  if (data.updatedAt) {
    const currentTime = currentBuyer.updatedAt.getTime();
    const providedTime = data.updatedAt.getTime();
    
    // Allow small time differences (within 1 second) due to timestamp precision
    if (Math.abs(currentTime - providedTime) > 1000) {
      throw new Error('Record changed, please refresh and try again');
    }
  }

  // Validate the data
  const validatedData = createBuyerSchema.partial().parse(data);
  
  // Process tags
  const tags = validatedData.tags?.length ? validatedData.tags : undefined;
  
  // Create diff for history
  const diff: Record<string, { old: any; new: any }> = {};
  
  Object.keys(validatedData).forEach(key => {
    const newValue = validatedData[key as keyof typeof validatedData];
    const oldValue = currentBuyer[key as keyof typeof currentBuyer];
    
    // Only add to diff if values are actually different and meaningful
    if (newValue !== oldValue && newValue !== undefined && newValue !== null && newValue !== '') {
      diff[key] = { old: oldValue, new: newValue };
    }
  });

  // Update the buyer
  const [updatedBuyer] = await db.update(buyers)
    .set({
      ...validatedData,
      tags,
      updatedAt: new Date(),
    })
    .where(eq(buyers.id, id))
    .returning();

  // Create history entry if there are changes
  if (Object.keys(diff).length > 0) {
    // Use a more precise timestamp to avoid duplicates
    const timestamp = new Date();
    
    // Check if a similar history entry already exists within the last second
    const existingEntry = await db.select()
      .from(buyerHistory)
      .where(
        and(
          eq(buyerHistory.buyerId, id),
          eq(buyerHistory.changedBy, userId),
          // Check if timestamp is within 1 second
          sql`abs(${buyerHistory.changedAt} - ${timestamp.getTime()}) < 1000`
        )
      )
      .limit(1);
    
    // Only create history entry if no similar entry exists
    if (existingEntry.length === 0) {
      await db.insert(buyerHistory).values({
        buyerId: id,
        changedBy: userId,
        changedAt: timestamp,
        diff,
      });
    }
  }

  revalidatePath('/buyers');
  revalidatePath(`/buyers/${id}`);
  return updatedBuyer;
}

export async function deleteBuyer(id: string, userId: string) {
  // Get the current buyer to check ownership
  const [currentBuyer] = await db.select().from(buyers).where(eq(buyers.id, id)).limit(1);
  
  if (!currentBuyer) {
    throw new Error('Buyer not found');
  }

  if (currentBuyer.ownerId !== userId) {
    throw new Error('Unauthorized: You can only delete your own leads');
  }

  // Delete buyer history first (to avoid foreign key constraint)
  await db.delete(buyerHistory).where(eq(buyerHistory.buyerId, id));
  
  // Then delete the buyer
  await db.delete(buyers).where(eq(buyers.id, id));

  revalidatePath('/buyers');
}

export async function getBuyer(id: string, userId: string) {
  const [buyer] = await db.select().from(buyers).where(eq(buyers.id, id)).limit(1);
  
  if (!buyer) {
    return null;
  }

  // Check if user can access this buyer (all users can read, but only owner can edit)
  return buyer;
}

export async function getBuyerHistory(id: string, userId: string) {
  // First check if buyer exists and user can access it
  const buyer = await getBuyer(id, userId);
  if (!buyer) {
    return [];
  }

  const history = await db.select({
    id: buyerHistory.id,
    buyerId: buyerHistory.buyerId,
    changedAt: buyerHistory.changedAt,
    diff: buyerHistory.diff,
    changedBy: buyerHistory.changedBy,
    changedByName: buyers.fullName,
  })
  .from(buyerHistory)
  .leftJoin(buyers, eq(buyerHistory.changedBy, buyers.ownerId))
  .where(eq(buyerHistory.buyerId, id))
  .orderBy(desc(buyerHistory.changedAt))
  .limit(10); // Get more entries to allow for deduplication

  // Deduplicate entries based on buyerId, changedBy, changedAt, and diff
  const seen = new Set();
  const deduplicatedHistory = history.filter(entry => {
    const key = `${entry.buyerId}-${entry.changedBy}-${entry.changedAt.getTime()}-${JSON.stringify(entry.diff)}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  }).slice(0, 5); // Take only the first 5 after deduplication

  return deduplicatedHistory;
}

export async function getAllRecentChanges(userId: string) {
  // Get recent changes from all buyers that the user can access
  const history = await db.select({
    id: buyerHistory.id,
    changedAt: buyerHistory.changedAt,
    diff: buyerHistory.diff,
    changedBy: buyerHistory.changedBy,
    changedByName: buyers.fullName,
  })
  .from(buyerHistory)
  .leftJoin(buyers, eq(buyerHistory.changedBy, buyers.ownerId))
  .where(eq(buyers.ownerId, userId))
  .orderBy(desc(buyerHistory.changedAt))
  .limit(10);

  return history;
}

export async function getBuyers({
  page = 1,
  search = '',
  city = '',
  propertyType = '',
  status = '',
  timeline = '',
  sort = 'updatedAt-desc',
}: {
  page?: number;
  search?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
  sort?: string;
}) {
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  // Build where conditions
  const conditions = [];
  
  if (search) {
    conditions.push(
      or(
        like(buyers.fullName, `%${search}%`),
        like(buyers.phone, `%${search}%`),
        like(buyers.email, `%${search}%`)
      )
    );
  }
  
  if (city) {
    conditions.push(eq(buyers.city, city as any));
  }
  
  if (propertyType) {
    conditions.push(eq(buyers.propertyType, propertyType as any));
  }
  
  if (status) {
    conditions.push(eq(buyers.status, status as any));
  }
  
  if (timeline) {
    conditions.push(eq(buyers.timeline, timeline as any));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Build order by - default to createdAt if sort field is invalid
  const [sortField, sortDirection] = sort.split('-');
  let orderBy = desc(buyers.createdAt);
  
  if (sortField === 'fullName') {
    orderBy = sortDirection === 'asc' ? asc(buyers.fullName) : desc(buyers.fullName);
  } else if (sortField === 'city') {
    orderBy = sortDirection === 'asc' ? asc(buyers.city) : desc(buyers.city);
  } else if (sortField === 'status') {
    orderBy = sortDirection === 'asc' ? asc(buyers.status) : desc(buyers.status);
  } else if (sortField === 'createdAt') {
    orderBy = sortDirection === 'asc' ? asc(buyers.createdAt) : desc(buyers.createdAt);
  }

  // Get total count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(buyers)
    .where(whereClause);

  // Get buyers
  const buyersList = await db
    .select()
    .from(buyers)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(pageSize)
    .offset(offset);

  const totalCount = count;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    buyers: buyersList,
    totalCount,
    totalPages,
    currentPage: page,
  };
}
