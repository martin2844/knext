module.exports = {
  client: "better-sqlite3",
  connection: {
    filename: process.env.DATABASE_PATH || "./db.sqlite",
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
