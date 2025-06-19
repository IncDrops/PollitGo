// src/hooks/useAuth.ts
'use client'; // Required for useSession

import { useSession } from 'next-auth/react';
import type { User as NextAuthUser } from 'next-auth'; // Default NextAuth user type

// Define your AppUser interface based on what your application needs
// This might evolve as you add more user profile details from your database
export interface AppUser {
  id: string;
  email: string | null | undefined;
  name: string | null | undefined;
  image?: string | null | undefined; // Optional: if you use avatars
  // Add other properties your app expects from a user object
}

const useAuth = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  let appUser: AppUser | null = null;

  if (session?.user) {
    // Map NextAuth session user to your AppUser type
    // Ensure the 'id' field is correctly mapped. NextAuth token might store it as 'sub' or 'id'.
    // The JWT callback in [...nextauth]/route.ts should ensure `token.id` is populated.
    appUser = {
      id: (session.user as NextAuthUser & { id: string }).id || '', // Type assertion for id
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    };
  }

  return {
    user: appUser, // This will be your AppUser structure or null
    loading,      // true if session is being fetched, false otherwise
    isAuthenticated: status === 'authenticated', // Helper boolean
    sessionStatus: status, // 'loading', 'authenticated', 'unauthenticated'
  };
};

export default useAuth;
