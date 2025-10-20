'use client';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
      <g fill="none" fillRule="evenodd">
        <path fill="#4285F4" d="M23.49,12.27 C23.49,11.48 23.42,10.73 23.28,10 L12,10 L12,14.51 L18.47,14.51 C18.2,15.99 17.51,17.24 16.38,18.03 L16.38,21.09 L20.25,21.09 C22.36,19.23 23.49,16.03 23.49,12.27 Z" />
        <path fill="#34A853" d="M12,24 C15.24,24 17.95,22.92 19.94,21.09 L16.38,18.03 C15.28,18.73 13.78,19.25 12,19.25 C8.97,19.25 6.4,17.15 5.48,14.51 L1.62,14.51 L1.62,17.57 C3.53,21.4 7.4,24 12,24 Z" />
        <path fill="#FBBC05" d="M5.48,14.51 C5.23,13.77 5.09,12.98 5.09,12 C5.09,11.02 5.23,10.23 5.48,9.49 L5.48,6.43 L1.62,6.43 C0.58,8.53 0,10.18 0,12 C0,13.82 0.58,15.47 1.62,17.57 L5.48,14.51 Z" />
        <path fill="#EA4335" d="M12,4.75 C13.91,4.75 15.4,5.43 16.59,6.55 L20.33,2.81 C18.23,0.96 15.4,0 12,0 C7.4,0 3.53,2.6 1.62,6.43 L5.48,9.49 C6.4,6.85 8.97,4.75 12,4.75 Z" />
      </g>
    </svg>
  );

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Leaf className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome to HabitZen</CardTitle>
          <CardDescription>Sign in to continue your journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={login} className="w-full">
            <GoogleIcon className="mr-2 -ml-1" />
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          <p>By signing in, you agree to our terms of service.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
