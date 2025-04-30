"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setError(null); // Clear error on auth state change
    });
    return () => unsubscribe();
  }, []);

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

  const socialSignIn = async (provider: FirebaseAuthProvider) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      // Auth state listener will handle setting user and loading state
    } catch (err) {
        handleAuthError(err);
    }
  };

  const signInWithGoogle = () => socialSignIn(new GoogleAuthProvider());
  const signInWithGithub = () => socialSignIn(new GithubAuthProvider());
  const signInWithFacebook = () => socialSignIn(new FacebookAuthProvider()); // Note: Requires Facebook App setup

  const registerWithEmail = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      // Auth state listener will handle setting user and loading state
    } catch (err) {
      handleAuthError(err);
    }
  };

  const loginWithEmail = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
       // Auth state listener will handle setting user and loading state
    } catch (err) {
       handleAuthError(err);
    }
  };


  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      // Auth state listener will handle setting user and loading state
    } catch (err) {
      handleAuthError(err);
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithGithub,
    signInWithFacebook,
    registerWithEmail,
    loginWithEmail,
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
