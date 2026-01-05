import db from "../services/db.js";
import { Database, OTPTable } from "../database/schema.js";
import { Kysely, Transaction } from "kysely";

type Executor = Kysely<Database> | Transaction<Database>;

export const exec = (trx?: Executor) => trx ?? db;

// export interface OTPTable {
//     id: Generated<number>;
//     user_id: number;
//     code_hash: string;
//     expires_at: Date;
//     used_at: Date;
//     created_at: Date;
// }

type newOTP = {
    code_hash: string;
    user_id: number;
};

// @param      params - newOTP
// @returns    OTP Entry - OTPTable
// @notes      creates an otp
export const createOTP = async (params: newOTP) => {
    return await db
        .insertInto("otp")
        .values({
            ...params,
            expires_at: new Date(Date.now() + 5 * 60 * 1000),
            used_at: null,
            created_at: new Date(),
        })
        .execute();
};

// @param      code_hash - string
// @returns    void
// @notes      checks for the otp of a logged in user
export const checkOTP = async (code_hash: string) => {
    return await db
        .updateTable("otp")
        .set({
            used_at: new Date(),
        })
        .where("used_at", "is", null)
        .where("expires_at", ">", new Date())
        .where("code_hash", "=", code_hash)
        .returningAll()
        .executeTakeFirstOrThrow();
};
