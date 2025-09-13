import { redirect } from 'next/navigation';
import { getCurrentUser, createDemoUser, setUserSession } from '@/lib/auth/simple';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function LoginPage() {
  const user = await getCurrentUser();
  
  if (user) {
    redirect('/buyers');
  }

  async function handleLogin(formData: FormData) {
    'use server';
    
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    
    if (!email) {
      return;
    }

    const user = await createDemoUser(email, name);
    await setUserSession(user.id);
    redirect('/buyers');
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100/50">
        {/* Logo/Brand Section */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-2xl font-bold text-white">eS</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-3 text-gray-600 text-sm">
            Sign in to access your lead management dashboard
          </p>
        </div>

        <form action={handleLogin} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Name (optional)
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                className="h-12 rounded-xl border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="h-12 rounded-xl border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
            >
              Sign In to Dashboard
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Secure access to your professional lead management system
          </p>
        </div>
      </div>
    </div>
  );
}
