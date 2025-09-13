'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Buyer } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Users, Plus } from 'lucide-react';
import { DeleteButton } from '@/components/delete-button';

interface BuyersListProps {
  buyers: Buyer[];
  currentPage: number;
  totalPages: number;
  currentFilters: {
    search: string;
    city: string;
    propertyType: string;
    status: string;
    timeline: string;
    sort: string;
  };
  userId?: string;
}

export function BuyersList({ buyers, currentPage, totalPages, currentFilters, userId }: BuyersListProps) {
  const router = useRouter();
  if (buyers.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="relative mx-auto w-40 h-40 mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 rounded-full flex items-center justify-center shadow-2xl">
            <Users className="h-20 w-20 text-blue-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-bounce"></div>
        </div>
        <h3 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          No Leads Found
        </h3>
        <p className="text-gray-500 mb-10 max-w-lg mx-auto text-xl font-medium leading-relaxed">
          Start building your lead pipeline by creating your first buyer lead. 
          Your professional journey begins here!
        </p>
        <Link href="/buyers/new">
          <Button className="group bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 px-12 py-6 rounded-3xl font-bold text-white text-lg hover:scale-105 transform">
            <Plus className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
            Create Your First Lead
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300';
      case 'Qualified': return 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300';
      case 'Contacted': return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300';
      case 'Visited': return 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300';
      case 'Negotiation': return 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300';
      case 'Converted': return 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300';
      case 'Dropped': return 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300';
      default: return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300';
    }
  };

  const buildUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries({ ...currentFilters, ...newParams }).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return `/buyers?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    const url = buildUrl({ page: page.toString() });
    router.replace(url, { scroll: false });
  };

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-2xl border border-gray-200/30 shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 border-b border-gray-200/50">
                <th className="px-8 py-8 text-left text-sm font-black text-gray-500 uppercase tracking-wider">
                  Contact Information
                </th>
                <th className="px-8 py-8 text-left text-sm font-black text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-8 py-8 text-left text-sm font-black text-gray-500 uppercase tracking-wider">
                  Property Details
                </th>
                <th className="px-8 py-8 text-left text-sm font-black text-gray-500 uppercase tracking-wider">
                  Budget Range
                </th>
                <th className="px-8 py-8 text-left text-sm font-black text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-8 py-8 text-left text-sm font-black text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-8 text-left text-sm font-black text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-8 py-8 text-left text-sm font-black text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/20 bg-white/50">
              {buyers.map((buyer, index) => (
                <tr key={buyer.id} className="hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-indigo-50/30 transition-all duration-500 group border-b border-gray-100/50">
                  <td className="px-8 py-8">
                    <div className="flex items-center space-x-5">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                          <span className="text-xl font-black text-white">
                            {buyer.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-bold text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                          {buyer.fullName}
                        </div>
                        {buyer.email && (
                          <div className="text-sm text-gray-500 font-medium">{buyer.email}</div>
                        )}
                        <div className="text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full inline-block">
                          {buyer.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                      <div className="text-lg font-bold text-gray-700">
                        {buyer.city}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-gray-700">
                        {buyer.propertyType}
                      </div>
                      {buyer.bhk && (
                        <div className="text-sm text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-2xl inline-block font-bold border border-indigo-200">
                          {buyer.bhk} BHK
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    {buyer.budgetMin || buyer.budgetMax ? (
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-gray-700">
                          {buyer.budgetMin && formatCurrency(buyer.budgetMin)}
                          {buyer.budgetMin && buyer.budgetMax && ' - '}
                          {buyer.budgetMax && formatCurrency(buyer.budgetMax)}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Budget Range</div>
                      </div>
                    ) : (
                      <div className="text-lg text-gray-400 italic font-medium">Not specified</div>
                    )}
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
                      <div className="text-lg font-bold text-gray-700">
                        {buyer.timeline}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className={`inline-flex px-6 py-3 text-sm font-black rounded-2xl border-2 ${getStatusColor(buyer.status)} group-hover:scale-105 transition-all duration-300`}>
                      {buyer.status}
                    </span>
                  </td>
                  <td className="px-8 py-8">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 font-bold">
                        {formatDate(buyer.updatedAt)}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Last Updated</div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Link href={`/buyers/${buyer.id}`}>
                        <Button variant="ghost" size="sm" className="h-12 w-12 p-0 rounded-2xl hover:bg-blue-100 hover:text-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                          <Eye className="h-6 w-6" />
                        </Button>
                      </Link>
                      {userId && buyer.ownerId === userId && (
                        <>
                          <Link href={`/buyers/${buyer.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-12 w-12 p-0 rounded-2xl hover:bg-emerald-100 hover:text-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                              <Edit className="h-6 w-6" />
                            </Button>
                          </Link>
                          <DeleteButton 
                            buyerId={buyer.id} 
                            buyerName={buyer.fullName}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-sky-50/50 to-sky-100/30 px-8 py-6 border-t border-sky-200/50">
          <div className="flex items-center justify-between">
            <div className="text-lg text-gray-700">
              Showing page <span className="font-bold text-sky-700">{currentPage}</span> of{' '}
              <span className="font-bold text-sky-700">{totalPages}</span>
            </div>
            <div className="flex space-x-4">
              {currentPage > 1 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-6 py-3 rounded-2xl border-sky-300 hover:bg-sky-50 hover:border-sky-400 transition-all duration-300 text-sky-700 font-semibold"
                >
                  Previous
                </Button>
              )}
              {currentPage < totalPages && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-6 py-3 rounded-2xl border-sky-300 hover:bg-sky-50 hover:border-sky-400 transition-all duration-300 text-sky-700 font-semibold"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
