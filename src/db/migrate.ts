import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

async function main() {
  console.log("Running migrations");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error running migrations:", err);
  process.exit(1);
});
