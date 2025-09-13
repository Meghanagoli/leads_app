import Link from 'next/link';
import { getCurrentUser, clearUserSession } from '@/lib/auth/simple';
import { Button } from '@/components/ui/button';
import { Users, Plus, LogOut, Building2, User, Home, BarChart3 } from 'lucide-react';

export async function Navigation() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <nav className="bg-white/95 backdrop-blur-md shadow-xl border-b border-sky-100/50 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 bg-clip-text text-transparent">
                  eSahayak
                </h1>
                <p className="text-sm text-gray-400 -mt-1 font-medium">Professional Lead Management</p>
              </div>
            </Link>
            <Link href="/auth/login">
              <Button className="bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl font-semibold text-white">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  async function handleSignOut() {
    'use server';
    await clearUserSession();
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xl border-b border-sky-100/50 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link href="/buyers" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 bg-clip-text text-transparent">
                eSahayak
              </h1>
              <p className="text-sm text-gray-400 -mt-1 font-medium">Professional Lead Management</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link href="/buyers">
              <Button variant="ghost" className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-all duration-300 font-medium text-gray-500">
                <Users className="h-4 w-4" />
                <span>All Leads</span>
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="ghost" className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-all duration-300 font-medium text-gray-500">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
            </Link>
            <Link href="/buyers/new">
              <Button className="bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-xl font-semibold flex items-center space-x-2 text-white">
                <Plus className="h-4 w-4" />
                <span>New Lead</span>
              </Button>
            </Link>
            
            {/* User Profile Section */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-sky-50 to-sky-100/50 rounded-xl px-4 py-2 border border-sky-200/50">
                <div className="p-2 bg-gradient-to-br from-sky-400 to-sky-500 rounded-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700">
                    {user.name || user.email}
                  </span>
                  <span className="text-xs text-sky-600 font-medium">Active</span>
                </div>
              </div>
              <form action={handleSignOut}>
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="sm"
                  className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
