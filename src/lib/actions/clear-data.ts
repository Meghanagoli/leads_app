import { db, buyerHistory, buyers } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function clearAllData() {
  'use server';
  
  try {
    // Clear buyer history
    await db.delete(buyerHistory);
    
    // Clear buyers
    await db.delete(buyers);
    
    revalidatePath('/buyers');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}
