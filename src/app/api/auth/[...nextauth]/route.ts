// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// In a real application, you would import types for your User model
// For now, we'll use a generic User type from NextAuth
import type { User } from 'next-auth';

// THIS IS A PLACEHOLDER AUTHORIZE FUNCTION.
// In a real application, you would validate credentials against a database.
// You would also handle user creation (signup) separately or as part of this.
async function authorize(credentials: Record<string, string> | undefined): Promise<User | null> {
  // Ensure credentials are provided
  if (!credentials?.email || !credentials?.password) {
    console.log('Missing credentials');
    return null;
  }

  const { email, password } = credentials;

  // --- SIMULATION/PLACEHOLDER LOGIC ---
  // For demonstration, let's accept a specific test user
  // or any user if it's a "signup" attempt (distinguished by an optional flag or different endpoint in real app)
  // IMPORTANT: This is NOT secure and for demo purposes ONLY.
  if (email === "test@example.com" && password === "password") {
    console.log("Authorizing test user: test@example.com");
    return { id: "1", name: "Test User", email: "test@example.com", image: null };
  }

  // Simulate accepting any new "signup" for demonstration.
  // In a real app, signup creates a user in the DB, then login validates against DB.
  // Here, we'll just return a user object based on the email provided.
  console.log(`Simulating authorization/signup for: ${email}`);
  return { id: email, name: email.split('@')[0] || "New User", email: email, image: null };
  // --- END SIMULATION/PLACEHOLDER LOGIC ---

  // In a real application:
  // 1. Find user by email in your database.
  // 2. If user exists, compare hashed password.
  // 3. If match, return user object { id, name, email, ... }.
  // 4. If not, return null.
  // console.log('Invalid credentials in authorize function (placeholder)');
  // return null;
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
    // Add other providers here (e.g., Google, GitHub)
  ],
  session: {
    strategy: 'jwt', // Using JWT for session strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user id and name to the token right after signin
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        // token.picture = user.image; // if available
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        // session.user.image = token.picture; // if available
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout', // default
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (e.g. check your email)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  },
  secret: process.env.NEXTAUTH_SECRET, // Essential for production & JWT
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
