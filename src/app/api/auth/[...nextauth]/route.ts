// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { User } from 'next-auth';

// THIS IS A PLACEHOLDER AUTHORIZE FUNCTION.
// In a real application, you would validate credentials against a database.
async function authorize(credentials: Record<string, string> | undefined): Promise<User | null> {
  if (!credentials?.email || !credentials?.password) {
    console.log('Missing credentials');
    return null;
  }
  const { email, password } = credentials;

  if (email === "test@example.com" && password === "password") {
    console.log("Authorizing test user: test@example.com");
    return { id: "1", name: "Test User", email: "test@example.com", image: null };
  }
  console.log(`Simulating authorization/signup for: ${email}`);
  return { id: email, name: email.split('@')[0] || "New User", email: email, image: null };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john.doe@example.com" },
        password: { label: "Password", type: "password" }
      },
      authorize: authorize
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

let GetHandler: Function;
let PostHandler: Function;

if (!process.env.NEXTAUTH_SECRET) {
  console.error(
    'CRITICAL NEXTAUTH_SECRET ERROR: The NEXTAUTH_SECRET environment variable is NOT SET. ' +
    'NextAuth.js WILL FAIL. This can lead to build errors (like missing manifests) and runtime errors. ' +
    'Ensure this variable is set in your environment (e.g., .env.local for local development, ' +
    'Vercel project settings for Vercel deployments, Google Cloud Build environment variables for Studio prototypes).'
  );
  
  const criticalErrorResponse = () => new Response(
    JSON.stringify({ 
      error: "Server misconfiguration: NEXTAUTH_SECRET is missing.",
      message: "The authentication system is not properly configured. Please contact support or check server logs." 
    }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
  GetHandler = criticalErrorResponse;
  PostHandler = criticalErrorResponse;

} else {
  try {
    const handler = NextAuth(authOptions);
    GetHandler = handler;
    PostHandler = handler;
  } catch (error: any) {
    console.error('Error initializing NextAuth:', error.message, error.stack);
    const errorResponse = () => new Response(
      JSON.stringify({ 
        error: "NextAuth initialization failed. Check server logs.", 
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    GetHandler = errorResponse;
    PostHandler = errorResponse;
  }
}

export { GetHandler as GET, PostHandler as POST };
