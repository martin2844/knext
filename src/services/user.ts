import "server-only";

import type { Knex } from "knex";
import db from "@/lib/db";
import type { OAuthUser, PersistedUser } from "@/types/user";

export async function findOrCreateUser(
  user: OAuthUser,
  database: Knex = db
): Promise<PersistedUser> {
  const identity = {
    provider: user.provider,
    provider_account_id: user.providerAccountId,
  };
  const profile = {
    name: user.name,
    email: user.email,
    image: user.image,
  };

  const [accountUser] = await database<PersistedUser>("users")
    .where(identity)
    .update(profile)
    .returning("*");

  if (accountUser) {
    return accountUser;
  }

  // Claim a legacy row atomically. The null identity guard prevents a
  // different OAuth account from taking over an already-linked email.
  const [legacyUser] = await database<PersistedUser>("users")
    .where({ email: user.email })
    .whereNull("provider")
    .whereNull("provider_account_id")
    .update({ ...profile, ...identity })
    .returning("*");

  if (legacyUser) {
    return legacyUser;
  }

  const [storedUser] = await database<PersistedUser>("users")
    .insert({ id: user.id, ...profile, ...identity })
    .onConflict(["provider", "provider_account_id"])
    .merge(["name", "email", "image"])
    .returning("*");

  if (!storedUser) {
    throw new Error("OAuth user could not be persisted");
  }

  return storedUser;
}
