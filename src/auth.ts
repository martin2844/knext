import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { findOrCreateUser } from "@/services/user"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Assuming AUTH_GITHUB_ID and AUTH_GITHUB_SECRET environment variables are set.
    // Auth.js automatically picks them up based on the provider name.
    GitHub,
  ],
  // Assuming AUTH_SECRET environment variable is set.
  // secret: process.env.AUTH_SECRET, // Explicitly setting is usually not needed if env var is set

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (
          !user.id ||
          !user.name ||
          !user.email ||
          !account?.provider ||
          !account.providerAccountId
        ) {
          console.error(
            "SignIn callback: OAuth user or account is missing required fields."
          )
          return false
        }

        const appUser = await findOrCreateUser({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        })

        // Auth.js creates a transient id without an adapter. Replace it with
        // the canonical application id before the JWT subject is generated.
        user.id = appUser.id
      } catch (error) {
        console.error("Error while persisting the OAuth user:", error)
        return false
      }
      return true
    },
  },
})
