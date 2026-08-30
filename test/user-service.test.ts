import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import knex, { type Knex } from "knex";
import { findOrCreateUser } from "../src/services/user";

const migrationsDirectory = path.resolve("src/migrations");

async function createDatabase(): Promise<{
  database: Knex;
  directory: string;
}> {
  const directory = await mkdtemp(path.join(tmpdir(), "knext-test-"));
  const database = knex({
    client: "better-sqlite3",
    connection: { filename: path.join(directory, "db.sqlite") },
    useNullAsDefault: true,
    migrations: { directory: migrationsDirectory },
  });

  return { database, directory };
}

async function disposeDatabase(database: Knex, directory: string) {
  await database.destroy();
  await rm(directory, { recursive: true, force: true });
}

test("the legacy email migration removes duplicates before adding uniqueness", async () => {
  const { database, directory } = await createDatabase();

  try {
    await database.migrate.up({ name: "20240425141133_users.js" });
    await database("users").insert([
      { id: "b", name: "Second", email: "same@example.com", image: null },
      { id: "a", name: "First", email: "same@example.com", image: null },
    ]);

    await database.migrate.latest();

    const users = await database("users")
      .where({ email: "same@example.com" })
      .select("id");
    assert.deepEqual(users, [{ id: "a" }]);
    await assert.rejects(
      database("users").insert({
        id: "c",
        name: "Duplicate",
        email: "same@example.com",
        image: null,
      }),
      /UNIQUE constraint failed/
    );
  } finally {
    await disposeDatabase(database, directory);
  }
});

test("an OAuth account keeps the canonical application user id", async () => {
  const { database, directory } = await createDatabase();

  try {
    await database.migrate.latest();
    const first = await findOrCreateUser(
      {
        id: "transient-first",
        name: "Martin",
        email: "martin@example.com",
        image: null,
        provider: "github",
        providerAccountId: "2844",
      },
      database
    );
    const second = await findOrCreateUser(
      {
        id: "transient-second",
        name: "Martin Updated",
        email: "martin@example.com",
        image: "https://example.com/avatar.png",
        provider: "github",
        providerAccountId: "2844",
      },
      database
    );

    assert.equal(first.id, "transient-first");
    assert.equal(second.id, first.id);
    assert.equal(second.name, "Martin Updated");
    const result = await database("users").count({ count: "*" }).first();
    assert.equal(Number(result?.count), 1);
  } finally {
    await disposeDatabase(database, directory);
  }
});

test("a legacy email is linked without changing its application user id", async () => {
  const { database, directory } = await createDatabase();

  try {
    await database.migrate.latest();
    await database("users").insert({
      id: "legacy-id",
      name: "Legacy",
      email: "legacy@example.com",
      image: null,
    });

    const linked = await findOrCreateUser(
      {
        id: "transient-id",
        name: "Current",
        email: "legacy@example.com",
        image: null,
        provider: "github",
        providerAccountId: "legacy-account",
      },
      database
    );

    assert.equal(linked.id, "legacy-id");
    assert.equal(linked.provider, "github");
    assert.equal(linked.provider_account_id, "legacy-account");
  } finally {
    await disposeDatabase(database, directory);
  }
});
