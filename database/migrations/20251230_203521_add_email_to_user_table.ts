import { Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .alterTable("user")
        .addColumn("email", "text", (col) => col.unique())
        .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema.alterTable("user").dropColumn("email").execute();
};
