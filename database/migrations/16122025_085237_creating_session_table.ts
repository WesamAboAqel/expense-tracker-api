import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .createTable("sessions")
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("user_id", "integer", (col) => col.notNull())
        .addForeignKeyConstraint(
            "sessions_user_id_fk",
            ["user_id"],
            "user",
            ["id"],
            (cb) => cb.onDelete("cascade")
        )
        .addColumn("refresh_token_hash", "varchar", (col) =>
            col.notNull().unique()
        )
        .addColumn("created_at", "timestamptz", (col) =>
            col.notNull().defaultTo(sql`now()`)
        )
        .addColumn("expires_at", "timestamptz", (col) => col.notNull())
        .addColumn("revoked_at", "timestamptz", (col) => col.defaultTo(null))
        .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema.dropTable("sessions").execute();
};
