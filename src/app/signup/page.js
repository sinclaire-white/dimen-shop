'use client';  
import { useForm } from 'react-hook-form';  // Form library for state/validation
import { zodResolver } from '@hookform/resolvers/zod';  // Zod integration (JS-only)
import { z } from 'zod';  // Zod for schema validation
import { useRouter } from 'next/navigation';  // For client-side redirects
import { signIn } from 'next-auth/react';  // For auto-login after sign-up
import { useSyncedUser } from '@/lib/store';  // Global user state
import axios from 'axios';  // For API requests (replaces fetch)

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
        alert('Sign-up successful, but login failed. Please try signing in.');
      }
    } catch (error) {
      // Handle API/Zod errors
      if (error.response?.status === 400) {
        alert(error.response.data.error || 'Invalid input');
      } else if (error.response?.status === 409) {
        alert('User already exists');
      } else {
        // Network/other errors
        console.error('Sign-up error:', error);
        alert('An unexpected error occurred.');
      }
    } finally {
      // Always stop loading
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Page header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Join our e-commerce community</p>
        </div>
        {/* Form: Uses Tailwind for styling */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Name Input: Zod validates via resolver */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                {...register('name')}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {/* Error display: Auto from Zod */}
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            {/* Email: Zod validates format */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register('email')}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            {/* Password: Zod min length */}
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register('password')}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
            {/* Confirm Password: Zod refine for match */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register('confirmPassword')}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          {/* Submit Button: Disabled during submission to prevent duplicates */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        {/* Google OAuth Button: Triggers NextAuth sign-in flow */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}  // Redirects to home after success
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
}