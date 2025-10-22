'use client';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Form validation types
interface FormErrors {
  email?: string;
  password?: string;
}

// Supabase auth error mapping
const mapAuthError = (error: string): string => {
  // Common Supabase auth error codes and messages
  if (error.includes('Invalid login credentials') || error.includes('invalid_credentials')) {
    return 'Invalid email or password';
  }
  if (error.includes('Email not confirmed')) {
    return 'Please check your email and confirm your account';
  }
  if (error.includes('Too many requests')) {
    return 'Too many login attempts. Please try again later';
  }
  if (error.includes('Network request failed') || error.includes('fetch')) {
    return 'Connection error. Please try again.';
  }
  if (error.includes('User not found')) {
    return 'Invalid email or password';
  }
  // Generic fallback for unknown errors
  return 'An unexpected error occurred. Please try again.';
};

// Validation functions
const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return undefined;
};

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Focus on email field when component mounts
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Handle field blur events for real-time validation
  const handleEmailBlur = () => {
    const emailError = validateEmail(email);
    setFieldErrors(prev => ({ ...prev, email: emailError }));
  };

  const handlePasswordBlur = () => {
    const passwordError = validatePassword(password);
    setFieldErrors(prev => ({ ...prev, password: passwordError }));
  };

  // Clear auth error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (authError) setAuthError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (authError) setAuthError(null);
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setFieldErrors({
      email: emailError,
      password: passwordError
    });

    return !emailError && !passwordError;
  };

  const handleLogin = async () => {
    // Clear previous auth error
    setAuthError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await login(email, password);
      if (error) {
        const userFriendlyError = mapAuthError(error);
        setAuthError(userFriendlyError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome to HabitUp</CardTitle>
          <CardDescription>Sign in to continue your journey.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {authError}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              ref={emailInputRef}
              id="email" 
              type="email"
              placeholder="alex@example.com" 
              value={email} 
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className={fieldErrors.email ? 'border-red-500' : ''}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500">{fieldErrors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className={fieldErrors.password ? 'border-red-500' : ''}
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-500">{fieldErrors.password}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            onClick={handleLogin} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our terms of service.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
