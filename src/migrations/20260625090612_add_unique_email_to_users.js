/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Older releases allowed duplicate emails. Keep the lexicographically first
  // id for each email so this migration is deterministic and can finish.
  await knex.raw(`
    DELETE FROM users
    WHERE id NOT IN (
      SELECT MIN(id)
      FROM users
      GROUP BY email
    )
  `);

  await knex.schema.alterTable("users", (table) => {
    table.unique("email");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.dropUnique("email");
  });
};
