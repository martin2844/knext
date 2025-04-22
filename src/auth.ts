import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { findOrCreateUser } from "@/services/user"; 
import type { User } from "next-auth" 
import type { AdapterUser } from "next-auth/adapters" 
import type { User as AppUser } from "@/types/user"; 

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Assuming AUTH_GITHUB_ID and AUTH_GITHUB_SECRET environment variables are set.
    // Auth.js automatically picks them up based on the provider name.
    GitHub,
  ],
  // Assuming AUTH_SECRET environment variable is set.
  // secret: process.env.AUTH_SECRET, // Explicitly setting is usually not needed if env var is set

  callbacks: {
    async signIn({ user }: { user: User | AdapterUser }) { // Use imported User type or AdapterUser if using an adapter
      // Ensure user object exists before proceeding
      if (!user) {
        console.error("SignIn callback received null or undefined user.");
        return false; // Prevent sign-in if user is not valid
      }
      try {
        // Ensure all required fields exist on the user object from the provider
        if (!user.id || !user.name || !user.email) {
          console.error(
            "SignIn callback: User object missing required fields (id, name, or email)."
          );
          return false; // Or handle appropriately
        }

        // Map the Auth.js user object to your application's User type
        const appUser: AppUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? "", // Map image to avatar_url, provide a default empty string if image is null/undefined
        };

        await findOrCreateUser(appUser); // Pass the correctly typed user object
      } catch (error) {
        console.error(
          "Error during findOrCreateUser in signIn callback:",
          error
        );
        // Returning false prevents the user from signing in.
        // You might want to redirect to an error page or return true depending on your desired behavior.
        return false;
      }
      // If findOrCreateUser succeeds, allow the sign-in.
      return true;
    },
    // You might need to add other callbacks like 'session' or 'jwt'
    // depending on your application's needs and session strategy (database vs. jwt).
    // Example session callback (if needed):
    // async session({ session, token, user }) {
    //   // Add custom properties to the session object
    //   session.user.id = token.sub ?? user.id; // Example: adding user ID
    //   return session;
    // },
    // Example jwt callback (if using JWT strategy):
    // async jwt({ token, user, account, profile }) {
    //   if (account) { // On sign in
    //     token.accessToken = account.access_token;
    //     token.id = user?.id;
    //   }
    //   return token;
    // }
  },
  // If you are using a database adapter (like Prisma), configure it here:
  // import { PrismaAdapter } from "@auth/prisma-adapter"
  // import { PrismaClient } from "@prisma/client" // Or your db client import
  // const prisma = new PrismaClient()
  // adapter: PrismaAdapter(prisma),

  // If using Prisma adapter AND need Edge compatibility (e.g., in middleware),
  // you might need to force JWT strategy and split config (see migration guide).
  // session: { strategy: "jwt" },

  // Add other configurations like pages, debug, etc. if needed.
  // pages: {
  //   signIn: '/auth/signin', // Example custom sign-in page
  // },
  // debug: process.env.NODE_ENV === 'development',
});

// Remember to update your environment variables:
// GITHUB_ID -> AUTH_GITHUB_ID
// GITHUB_SECRET -> AUTH_GITHUB_SECRET
// NEXTAUTH_SECRET -> AUTH_SECRET
// NEXTAUTH_URL (optional) -> AUTH_URL (optional) 