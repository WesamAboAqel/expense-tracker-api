import { Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .alterTable("user")
        .addColumn("google_id", "text", (col) => col.defaultTo(null).unique())
        .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema.alterTable("user").dropColumn("google_id").execute();
};
