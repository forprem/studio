"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
  getRedirectResult,
  UserCredential
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase/config';
import type { AuthProvider as FirebaseAuthProvider } from 'firebase/auth';

import type { z } from 'zod';

import type { loginSchema, registerSchema } from '@/schemas/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  registerWithEmail: (data: z.infer<typeof registerSchema>) => Promise<void>;
  loginWithEmail: (data: z.infer<typeof loginSchema>) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();
  console.log('AuthContext AuthProvider component rendered. Initial firebaseAuth value:', firebaseAuth);

  useEffect(() => {
    console.log('AuthContext useEffect called');
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      console.log('onAuthStateChanged called:', currentUser);
      setUser(currentUser);
      setLoading(false);
      setError(null); // Clear error on auth state change
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('AuthContext redirect handler useEffect called');
    console.log('Value of firebaseAuth object:', firebaseAuth);
    getRedirectResult(firebaseAuth)
      .then((result: UserCredential | null) => {
        if (result && result.user) {
          // User signed in with redirect
          console.log("Redirect result user:", result.user);
        }
      })
      .catch(handleAuthError); // Handle potential errors during redirect result retrieval
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleAuthError = (err: unknown) => {
    if (err instanceof Error && 'code' in err && 'message' in err) {
      // Check if it behaves like a Firebase AuthError
      const authError = err as AuthError;
      console.error("Firebase Auth Error:", authError.code, authError.message);
      setError(authError);
    } else {
      console.error("An unexpected error occurred:", err);
      // Create a generic AuthError-like object for consistency if needed
      setError({ code: 'unknown-error', message: 'An unexpected error occurred.' } as AuthError);
    }
    setLoading(false);
  }

  const handlePopupError = (err: unknown) => {
    if (typeof err === 'object' && err !== null && 'code' in err && err.code === 'auth/popup-blocked') {
      alert(
        'Popup blocked! Please allow popups for this site to sign in. You can enable it by clicking in the top right corner of the address bar.'
      );
    } else {
      console.error('Firebase Auth Popup Error:', err);
    }
  }

  const socialSignIn = async (provider: FirebaseAuthProvider) => {
    setLoading(true);
    setError(null);

    try {
      await signInWithRedirect(firebaseAuth, provider);
      router.push('/dashboard')
    } catch (err) {
      handlePopupError(err);
      handleAuthError(err);
    }
  };

  const googleSignIn = async () => {
    await socialSignIn(new GoogleAuthProvider());
  }

  const githubSignIn = async () => {
    await socialSignIn(new GithubAuthProvider());
  }

  const facebookSignIn = async () => {
    await socialSignIn(new FacebookAuthProvider()); // Note: Requires Facebook App setup
  }

  const registerWithEmail = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      handleAuthError(err)
    }
  };

  const emailSignIn = async (data: z.infer<typeof loginSchema>) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(firebaseAuth, data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      handlePopupError(err);
      handleAuthError(err);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(firebaseAuth);
      // Auth state listener will handle setting user and loading state
    } catch (err) {
      handleAuthError(err);
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle: googleSignIn,
    signInWithGithub: githubSignIn,
    signInWithFacebook: facebookSignIn,
    registerWithEmail,
    loginWithEmail: emailSignIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
