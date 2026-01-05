import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .createTable("otp")
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("user_id", "integer", (col) => col.notNull())
        .addForeignKeyConstraint(
            "otp_user_id_fk",
            ["user_id"],
            "user",
            ["id"],
            (cb) => cb.onDelete("cascade")
        )
        .addColumn("code_hash", "text", (col) => col.notNull())
        .addColumn("expires_at", "timestamptz", (col) =>
            col.defaultTo(sql`now() + INTERVAL '10 minutes'`)
        )
        .addColumn("used_at", "timestamptz", (col) =>
            col.notNull().defaultTo(null)
        )
        .addColumn("created_at", "timestamptz", (col) =>
            col.notNull().defaultTo(sql`now()`)
        )
        .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema.dropTable("otp").execute();
};
