/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  knex.schema
    .createTable("users", (table) => {
      table.string("id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("image");
    })
    .then(() => console.log("Migration done"));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.dropTable("users").then(() => console.log("Rollback done"));
};
