'use client';  
import { useState } from 'react';
import { useForm } from 'react-hook-form';  // Form library for state/validation
import { zodResolver } from '@hookform/resolvers/zod';  // Zod integration (JS-only)
import { z } from 'zod';  // Zod for schema validation
import { useRouter } from 'next/navigation';  // For client-side redirects
import { signIn } from 'next-auth/react';  // For auto-login after sign-up
import { useSyncedUser } from '@/lib/store';  // Global user state
import Link from 'next/link';
import axios from 'axios';  // For API requests (replaces fetch)

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShineBorder } from '@/components/ui/shine-border';
import { ShinyButton } from '@/components/ui/shiny-button';

// Zod schema: Defines/validates form shape (matches server)
const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],  // Attaches error to confirm field
});

// Main sign-up component
export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();  // Router for navigation
  const { setLoading } = useSyncedUser();  // Global loading from Zustand

  // Form setup: Integrates Zod for validation
  const {
    register,  // Registers inputs with Zod rules
    handleSubmit,  // Handles form submission
    formState: { errors, isSubmitting },  // Access errors and submit state
    reset,  // Clears form after success
  } = useForm({
    resolver: zodResolver(signUpSchema),  // Zod resolver for real-time validation
    mode: 'onChange',  // Validate as user types (better UX)
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    // Show global loading during API call
    setLoading(true);
    try {
      // Axios POST: Simpler than fetch, auto-JSON
      const res = await axios.post('/api/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Success: Auto-sign in with new credentials (no redirect yet)
      const signInRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,  // Handle redirect manually
      });

      // Success: Clear form, redirect home, Zustand auto-syncs user
      if (signInRes?.ok) {
        reset();
        router.push('/');  // Redirect to home/dashboard
      } else {
        // Rare edge case: Sign-up worked but login failed
        setError('Account created but login failed. Please try logging in manually.');
      }
    } catch (error) {
      // Handle API/Zod errors
      if (error.response?.status === 400) {
        setError(error.response.data.error || 'Invalid input');
      } else if (error.response?.status === 409) {
        setError('User already exists');
      } else {
        // Network/other errors
        console.error('Sign-up error:', error);
        setError('An unexpected error occurred.');
      }
    } finally {
      // Always stop loading
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      setError('Failed to sign in with Google');
      console.error('Google sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary">DimenShop</h1>
            <p className="text-sm text-muted-foreground mt-2">3D Models Marketplace</p>
          </Link>
        </div>

        <Card className="relative w-full max-w-md mx-auto overflow-hidden">
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-foreground">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Join our 3D printing community today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    {...register('name')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    {...register('password')}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
              <ShinyButton 
                type="submit" 
                disabled={isLoading}
                className="w-full disabled:opacity-50 font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </ShinyButton>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <ShinyButton
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full font-medium"
            >
              Sign up with Google
            </ShinyButton>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}