'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface DeleteButtonProps {
  buyerId: string;
  buyerName: string;
}

export function DeleteButton({ buyerId, buyerName }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/buyers/${buyerId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/buyers?deleted=true');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete lead. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to delete lead. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex space-x-2">
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="destructive"
          size="sm"
          className="h-10 px-3 rounded-xl"
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </Button>
        <Button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          variant="ghost"
          size="sm"
          className="h-10 px-3 rounded-xl"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setShowConfirm(true)}
      variant="ghost"
      size="sm"
      className="h-10 w-10 p-0 rounded-xl hover:bg-red-100 hover:text-red-700 shadow-sm"
      title={`Delete ${buyerName}`}
    >
      <Trash2 className="h-5 w-5" />
    </Button>
  );
}
