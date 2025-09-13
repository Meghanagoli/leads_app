import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/simple';
import { getBuyer, updateBuyer } from '@/lib/actions/buyer';
import { BuyerForm } from '@/components/buyer-form';
import { CreateBuyerData } from '@/lib/validations/buyer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

interface EditBuyerPageProps {
  params: {
    id: string;
  };
}

export default async function EditBuyerPage({ params }: EditBuyerPageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const { id } = await params;
  const buyer = await getBuyer(id, user.id);
  
  if (!buyer) {
    notFound();
  }

  // Check if user owns this buyer
  if (buyer.ownerId !== user.id) {
    redirect('/buyers');
  }

  async function handleUpdateBuyer(data: CreateBuyerData & { updatedAt?: Date }) {
    'use server';
    
    try {
      await updateBuyer(id, data, user!.id);
      revalidatePath('/buyers');
      revalidatePath(`/buyers/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update lead' };
    }
  }

  // Convert buyer data to form data format
  const formData: CreateBuyerData & { updatedAt: Date } = {
    fullName: buyer.fullName,
    email: buyer.email || '',
    phone: buyer.phone,
    city: buyer.city,
    propertyType: buyer.propertyType,
    bhk: buyer.bhk || undefined,
    purpose: buyer.purpose,
    budgetMin: buyer.budgetMin || undefined,
    budgetMax: buyer.budgetMax || undefined,
    timeline: buyer.timeline,
    source: buyer.source,
    status: buyer.status,
    notes: buyer.notes || '',
    tags: Array.isArray(buyer.tags) ? buyer.tags : (buyer.tags ? [buyer.tags] : []),
    updatedAt: buyer.updatedAt,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link href={`/buyers/${buyer.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lead
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Lead</h1>
        <p className="mt-2 text-gray-600">
          Update the information for {buyer.fullName}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <BuyerForm 
          onSubmit={handleUpdateBuyer} 
          initialData={formData}
        />
      </div>
    </div>
  );
}
