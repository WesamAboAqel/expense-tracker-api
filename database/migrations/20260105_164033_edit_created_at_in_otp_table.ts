import { Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .alterTable("otp")
        .alterColumn("used_at", (col) => col.dropNotNull())
        .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .alterTable("otp")
        .alterColumn("used_at", (col) => col.setNotNull())
        .execute();
};
