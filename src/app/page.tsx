"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("page.tsx: useEffect - user:", user, "loading:", loading);
    getRedirectResult(auth).then((result) => {
      if(result){
        router.push('/dashboard');
      }
    })
    if (!loading) {
      if (user) {
         router.push('/dashboard'); // Use replace to avoid adding to history
      } else {
 router.push('/auth/login');
      }
    }
  }, [user, loading, router]);

  // Optional: Show a loading indicator while checking auth status
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  // This part might not be reached if redirection happens quickly
  return null; // Or a loading component
}
