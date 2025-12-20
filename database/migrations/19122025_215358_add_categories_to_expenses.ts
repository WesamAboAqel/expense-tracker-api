import { Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .alterTable("expenses")
        .addColumn("category", "varchar", (col) =>
            col.notNull().defaultTo("Others")
        )
        .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema.alterTable("expenses").dropColumn("category").execute();
};
