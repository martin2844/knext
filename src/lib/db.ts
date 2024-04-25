import knex from "knex";

const config = {
  client: "better-sqlite3",
  connection: {
    filename: "./db.sqlite",
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./src/migrations",
    loadExtensions: [".ts", ".js"],
  },
  seeds: {
    directory: "./src/seeds",
    loadExtensions: [".ts", ".js"],
  },
};

// Can only be imported from SSR files
export default knex(config);
