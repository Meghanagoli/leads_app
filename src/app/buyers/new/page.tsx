import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/simple';
import { BuyerForm } from '@/components/buyer-form';
import { createBuyer } from '@/lib/actions/buyer';
import { CreateBuyerData } from '@/lib/validations/buyer';
import { revalidatePath } from 'next/cache';

export default async function NewBuyerPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  async function handleCreateBuyer(data: CreateBuyerData) {
    'use server';
    
    try {
      await createBuyer(data, user!.id);
      revalidatePath('/buyers');
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create lead' };
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Lead</h1>
        <p className="mt-2 text-gray-600">
          Add a new buyer lead to your system
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <BuyerForm onSubmit={handleCreateBuyer} />
      </div>
    </div>
  );
}
