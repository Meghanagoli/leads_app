'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export function SuccessToastHandler() {
  const searchParams = useSearchParams();
  const hasShownToast = useRef(false);
  const lastParams = useRef('');

  useEffect(() => {
    const currentParams = searchParams.toString();
    
    // Only show toast if params actually changed and we haven't shown one yet
    if (currentParams !== lastParams.current) {
      hasShownToast.current = false;
      lastParams.current = currentParams;
    }

    if (hasShownToast.current) return;

    if (searchParams.get('created') === 'true') {
      hasShownToast.current = true;
      toast.success('Lead created successfully! 🎉');
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('created');
      window.history.replaceState({}, '', url.toString());
    }
    
    if (searchParams.get('updated') === 'true') {
      hasShownToast.current = true;
      toast.success('Lead updated successfully! ✨');
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('updated');
      window.history.replaceState({}, '', url.toString());
    }
    
    if (searchParams.get('deleted') === 'true') {
      hasShownToast.current = true;
      toast.success('Lead deleted successfully! 🗑️');
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('deleted');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  return null;
}
