/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("users", (table) => {
    table.string("provider");
    table.string("provider_account_id");
  });

  await knex.schema.alterTable("users", (table) => {
    table.unique(["provider", "provider_account_id"], {
      indexName: "users_provider_account_unique",
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("users", (table) => {
    table.dropUnique(
      ["provider", "provider_account_id"],
      "users_provider_account_unique"
    );
  });

  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("provider");
    table.dropColumn("provider_account_id");
  });
};
