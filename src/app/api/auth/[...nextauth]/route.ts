import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { findOrCreateUser } from "@/services/user";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async signIn({ user }: any) {
      try {
        await findOrCreateUser(user);
      } catch (error) {
        console.log(error);
      }
      return true;
    },
  },
};

const handler = NextAuth({
  ...authOptions,
});

export { handler as GET, handler as POST };
