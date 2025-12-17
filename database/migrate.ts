import { Migrator, FileMigrationProvider } from "kysely";
import fs from "fs/promises";
import path from "path";
import db from "../services/db.js";

const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(process.cwd(), "./database/migrations"),
    }),
});

const run = async () => {
    try {
        const { error, results } = await migrator.migrateToLatest();

        results?.forEach((r) => {
            if (r.status === "Success") {
                console.log(`Migrated: ${r.migrationName}`);
            }
        });

        if (error) {
            console.error("Migration failed");
            console.error(error);
            return;
        }
    } finally {
        await db.destroy();
    }
};

run();
