import { Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .alterTable("user")
        .alterColumn("email", (col) => col.setNotNull())
        .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .alterTable("user")
        .alterColumn("email", (col) => col.dropNotNull())
        .execute();
};
