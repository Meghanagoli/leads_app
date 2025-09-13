import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/simple';
import { getBuyers } from '@/lib/actions/buyer';
import { BuyersList } from '@/components/buyers-list';
import { BuyersFilters } from '@/components/buyers-filters';
import { CsvActions } from '@/components/csv-actions';
import { Button } from '@/components/ui/button';
import { Plus, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';
// import { revalidatePath } from 'next/cache';

interface BuyersPageProps {
  searchParams: {
    page?: string;
    search?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
    sort?: string;
  };
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const city = params.city || '';
  const propertyType = params.propertyType || '';
  const status = params.status || '';
  const timeline = params.timeline || '';
  const sort = params.sort || 'updatedAt-desc';

  const { buyers, totalCount, totalPages } = await getBuyers({
    page,
    search,
    city,
    propertyType,
    status,
    timeline,
    sort,
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full translate-y-40 -translate-x-40 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
          
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-8 lg:space-y-0">
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="p-4 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl shadow-xl">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                  </div>
                  <div>
                    <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                      Buyer Leads
                    </h1>
                    <p className="text-2xl text-gray-500 font-semibold mt-2">
                      Professional Lead Management System
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="group bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-8 py-4 rounded-2xl font-bold border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-lg">{totalCount} Total Leads</span>
                    </div>
                  </div>
                  <div className="group bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 px-8 py-4 rounded-2xl font-bold border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-lg">Active Pipeline</span>
                    </div>
                  </div>
                  <div className="group bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-8 py-4 rounded-2xl font-bold border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-lg">Real-time Updates</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <CsvActions 
                  userId={user.id}
                  currentFilters={{
                    search,
                    city,
                    propertyType,
                    status,
                    timeline,
                  }}
                />
                
                <Link href="/buyers/new">
                  <Button className="group bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-5 rounded-2xl font-bold flex items-center space-x-3 w-full sm:w-auto text-white hover:scale-105 transform">
                    <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="text-lg">Create New Lead</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Advanced Filters & Search
                </h3>
                <p className="text-gray-400 font-medium">Refine your lead search with precision</p>
              </div>
            </div>
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200"></div>
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent absolute top-0 left-0"></div>
                </div>
                <span className="ml-4 text-gray-400 text-lg font-medium">Loading filters...</span>
              </div>
            }>
              <BuyersFilters 
                currentFilters={{
                  search,
                  city,
                  propertyType,
                  status,
                  timeline,
                  sort,
                }}
              />
            </Suspense>
          </div>
        </div>

        {/* Buyers List Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-teal-600/5 to-cyan-600/5 rounded-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
            <div className="p-8 border-b border-gray-200/30 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Lead Management Dashboard
                  </h3>
                  <p className="text-gray-400 font-medium">Manage and track your buyer leads</p>
                </div>
              </div>
            </div>
            <Suspense fallback={
              <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent absolute top-0 left-0"></div>
                </div>
                <span className="ml-6 text-gray-400 text-xl font-medium">Loading leads...</span>
              </div>
            }>
              <BuyersList 
                buyers={buyers}
                currentPage={page}
                totalPages={totalPages}
                currentFilters={{
                  search,
                  city,
                  propertyType,
                  status,
                  timeline,
                  sort,
                }}
                userId={user.id}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
