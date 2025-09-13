import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/simple';

export default async function Home() {
  const user = await getCurrentUser();
  
  if (user) {
    redirect('/buyers');
  } else {
    redirect('/auth/login');
  }
}
