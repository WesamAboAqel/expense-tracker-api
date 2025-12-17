import { Kysely, Transaction } from "kysely";
import db from "../services/db.js";
import { Database } from "../database/schema.js";
import { error } from "node:console";
import { response } from "express";

type newSession = {
    user_id: number;
    refresh_token_hash: string;
};

type Executor = Kysely<Database> | Transaction<Database>;

export const exec = (trx?: Executor) => trx ?? db;

// @param      sessionData - newSession - payload that contains all the data a session creation would need
// @returns    session - SessionTable - a session stored in the db
// @notes      Creates a session and returns it.
export const createSession = async (
    sessionData: newSession,
    trx?: Executor
) => {
    return await exec(trx)
        .insertInto("sessions")
        .values({
            ...sessionData,
            created_at: new Date(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
};

// @param      refreshTokenHash - string - session that has said token hash
// @returns    session: sessionTable
// @notes      returns a session
export const getSession = async (refreshTokenHash: string, trx?: Executor) => {
    return exec(trx)
        .selectFrom("sessions")
        .selectAll()
        .where("refresh_token_hash", "=", refreshTokenHash)
        .where("revoked_at", "is", null)
        .where("expires_at", ">", new Date())
        .executeTakeFirst();
};

// @param      id - number
// @returns    success
// @notes      revokes a session by id
export const revokeSession = async (id: number, trx?: Executor) => {
    return await exec(trx)
        .updateTable("sessions")
        .set({
            revoked_at: new Date(),
        })
        .where("id", "=", id)
        .execute();
};

// @param      params - oldRefreshTokenHash and new refresh_token_hash for a new session
// @returns    newSession - SessionTable
// @notes      Transaction that gets a session revokes it and makes a new session
export const refreshTransaction = async (params: any) => {
    return await db.transaction().execute(async (trx) => {
        const oldSession = await getSession(params.oldRefreshTokenHash, trx);

        if (!oldSession) {
            throw new Error("Session not found!");
        }

        await revokeSession(oldSession.id, trx);

        return createSession(
            {
                refresh_token_hash: params.refresh_token_hash,
                user_id: oldSession.user_id,
            },
            trx
        );
    });
};
