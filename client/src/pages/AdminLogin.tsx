import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Home, Lock, User } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { user, login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/admin/dashboard');
    }
  }, [user, setLocation]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    
    try {
      await login(data.username, data.password);
      // Redirect to admin dashboard on successful login
      setLocation('/admin/dashboard');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-green-100">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f97316_1px,transparent_1px),linear-gradient(to_bottom,#f97316_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.03]"></div>
        
        {/* Animated Circles */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-300/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Decorative Shapes */}
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-orange-300/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 border-4 border-green-300/20 rounded-lg rotate-45 animate-spin-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Back to Home Button - Icon Only */}
      <Link href="/">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 left-6 z-10 w-12 h-12 rounded-full hover:bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
          title="Back to Home"
        >
          <Home className="w-6 h-6 text-orange-600" />
        </Button>
      </Link>

      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-2 animate-slide-up">
        <CardHeader className="text-center space-y-4 pb-8">
          {/* Logo */}
          <div className="mx-auto mb-2 relative">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              किशोर ग्रामपंचायत
            </CardTitle>
            <CardTitle className="text-xl font-semibold text-gray-700">
              Admin Login
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to access the admin dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input 
                          placeholder="Enter username" 
                          className="pl-10 h-12 border-2 focus:border-orange-500 transition-colors"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input 
                          type="password" 
                          placeholder="Enter password" 
                          className="pl-10 h-12 border-2 focus:border-orange-500 transition-colors"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center font-medium">
                    {error}
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 text-center font-medium">
                  🔐 Demo credentials: <span className="font-bold">admin</span> / <span className="font-bold">admin123</span>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
