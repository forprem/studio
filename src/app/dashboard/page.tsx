"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login'); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // Show loading state or redirect handled above
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="items-center text-center">
               <Skeleton className="h-16 w-16 rounded-full mb-4" />
               <Skeleton className="h-6 w-3/4 mb-2" />
               <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="text-center space-y-4">
               <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
    );
  }

  // Display user info if authenticated
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
     <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center text-center">
           <Avatar className="w-16 h-16 mb-4">
             <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? "User Avatar"} />
             <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
           </Avatar>
          <CardTitle className="text-2xl font-bold text-primary">Dashboard</CardTitle>
          <CardDescription>Welcome, {user.displayName || user.email}!</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>You are logged in.</p>
          <Button onClick={signOut} variant="destructive">Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
