import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/simple';
import { getBuyer, getBuyerHistory } from '@/lib/actions/buyer';
import { BuyerDetail } from '@/components/buyer-detail';
import { BuyerHistory } from '@/components/buyer-history';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { SuccessToastHandler } from '@/components/success-toast-handler';
import { DeleteButton } from '@/components/delete-button';
// import { revalidatePath } from 'next/cache';

interface BuyerDetailPageProps {
  params: {
    id: string;
  };
}

export default async function BuyerDetailPage({ params }: BuyerDetailPageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const { id } = await params;
  const buyer = await getBuyer(id, user.id);
  
  if (!buyer) {
    notFound();
  }

  // Get buyer history for the Recent Changes section
  const history = await getBuyerHistory(id, user.id);
  const isOwner = buyer.ownerId === user.id;


  return (
    <div className="space-y-6">
      <SuccessToastHandler />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/buyers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leads
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{buyer.fullName}</h1>
            <p className="text-gray-600">Lead Details</p>
          </div>
        </div>
        {isOwner && (
          <div className="flex space-x-3">
            <Link href={`/buyers/${buyer.id}/edit`}>
              <Button className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Lead</span>
              </Button>
            </Link>
            <DeleteButton 
              buyerId={buyer.id} 
              buyerName={buyer.fullName}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BuyerDetail buyer={buyer} isOwner={isOwner} />
        </div>
        <div>
          <BuyerHistory history={history} />
        </div>
      </div>
    </div>
  );
}
