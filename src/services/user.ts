import "server-only";

import type { Knex } from "knex";
import db from "@/lib/db";
import type { OAuthUser, PersistedUser } from "@/types/user";

export async function findOrCreateUser(
  user: OAuthUser,
  database: Knex = db
): Promise<PersistedUser> {
  return database.transaction(async (trx) => {
    const identity = {
      provider: user.provider,
      provider_account_id: user.providerAccountId,
    };
    const profile = {
      name: user.name,
      email: user.email,
      image: user.image,
    };

    const accountUser = await trx<PersistedUser>("users")
      .where(identity)
      .first();

    if (accountUser) {
      await trx("users").where({ id: accountUser.id }).update(profile);
      return { ...accountUser, ...profile };
    }

    // Link rows created by older versions once, without allowing one OAuth
    // account to take over an email already linked to a different account.
    const legacyUser = await trx<PersistedUser>("users")
      .where({ email: user.email })
      .whereNull("provider")
      .whereNull("provider_account_id")
      .first();

    if (legacyUser) {
      await trx("users")
        .where({ id: legacyUser.id })
        .update({ ...profile, ...identity });
      return { ...legacyUser, ...profile, ...identity };
    }

    await trx("users")
      .insert({ id: user.id, ...profile, ...identity })
      .onConflict(["provider", "provider_account_id"])
      .merge(["name", "email", "image"]);

    const storedUser = await trx<PersistedUser>("users")
      .where(identity)
      .first();

    if (!storedUser) {
      throw new Error("OAuth user could not be persisted");
    }

    return storedUser;
  });
}
