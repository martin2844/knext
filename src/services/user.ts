import db from "@/lib/db";
import { User } from "@/types/user";

export async function findOrCreateUser(user: User) {
  const existingUser = await db("users").where({ email: user.email }).first();
  if (existingUser) {
    return existingUser;
  }
  await db("users").insert({ ...user });
  const newUser = await db("users").where({ email: user.email }).first();
  return newUser;
}
