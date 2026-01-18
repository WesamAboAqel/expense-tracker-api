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

type OTP = {
    code_hash: string;
    user_id: number;
};

// @param      params - newOTP
// @returns    OTP Entry - OTPTable
// @notes      creates an otp
export const createOTP = async (params: OTP) => {
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

// @param      params - OTP
// @returns    void
// @notes      checks for the otp of a logged in user
export const checkOTP = async (params: OTP) => {
    return await db
        .updateTable("otp")
        .set({
            used_at: new Date(),
        })
        .where("used_at", "is", null)
        .where("expires_at", ">", new Date())
        .where("code_hash", "=", params.code_hash)
        .where("user_id", "=", params.user_id)
        .returningAll()
        .executeTakeFirstOrThrow();
};
