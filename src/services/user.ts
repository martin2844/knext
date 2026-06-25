import "server-only";

import db from "@/lib/db";
import { User } from "@/types/user";

export async function findOrCreateUser(user: User) {
  // The email column has a unique constraint, so a plain check-then-insert
  // can race between concurrent OAuth callbacks. Use onConflict('email').ignore()
  // so the second insert is safely skipped, then re-select the canonical row.
  await db("users").insert({ ...user }).onConflict("email").ignore();
  return db("users").where({ email: user.email }).first();
}
