import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .createTable("expenses")
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("user_id", "integer", (col) => col.notNull())
        .addForeignKeyConstraint(
            "expense_user_id_fk",
            ["user_id"],
            "user",
            ["id"],
            (cb) => cb.onDelete("cascade")
        )
        .addColumn("description", "text", (col) =>
            col.defaultTo("Some Expenses")
        )
        .addColumn("amount", "integer", (col) => col.notNull().defaultTo(10))
        .addColumn("date", "timestamptz", (col) =>
            col.notNull().defaultTo(sql`now()`)
        )
        .addColumn("created_at", "timestamptz", (col) =>
            col.notNull().defaultTo(sql`now()`)
        )
        .addColumn("updated_at", "timestamptz", (col) => col.notNull())
        .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema.dropTable("expenses").execute();
};
