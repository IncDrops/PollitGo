// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { User } from 'next-auth';

// THIS IS A PLACEHOLDER AUTHORIZE FUNCTION.
// In a real application, you would validate credentials against a database.
async function authorize(credentials: Record<string, string> | undefined): Promise<User | null> {
  if (!credentials?.email || !credentials?.password) {
    console.log('Auth: Missing credentials');
    return null;
  }
  const { email, password } = credentials;

  // For demo purposes, allow test@example.com or any new email
  if (email === "test@example.com" && password === "password") {
    console.log("Auth: Authorizing test user: test@example.com");
    return { id: "user1", name: "Test User", email: "test@example.com", image: null };
  }
  
  // Simulate creating a new user on login attempt
  console.log(`Auth: Simulating authorization/signup for: ${email}`);
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
