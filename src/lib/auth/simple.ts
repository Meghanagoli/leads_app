import { cookies } from 'next/headers';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user-id')?.value;
  
  if (!userId) {
    return null;
  }

  try {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user[0] || null;
  } catch {
    return null;
  }
}

export async function createDemoUser(email: string, name?: string): Promise<User> {
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  
  if (existingUser[0]) {
    return existingUser[0];
  }

  const newUser = await db.insert(users).values({
    email,
    name: name || email.split('@')[0],
  }).returning();

  return newUser[0];
}

export async function setUserSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set('user-id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete('user-id');
}
