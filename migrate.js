const createKnex = require("knex");
const config = require("./knexfile");

async function migrate() {
  const database = createKnex(config);

  try {
    const [, migrations] = await database.migrate.latest();

    if (migrations.length === 0) {
      console.log("Database is already up to date");
      return;
    }

    console.log(`Applied ${migrations.length} migration(s)`);
  } finally {
    await database.destroy();
  }
}

migrate().catch((error) => {
  console.error("Database migration failed", error);
  process.exitCode = 1;
});
