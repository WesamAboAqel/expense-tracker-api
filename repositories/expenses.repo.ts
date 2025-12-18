import { Kysely, Transaction } from "kysely";
import db from "../services/db.js";
import { Database } from "../database/schema.js";

type Executor = Kysely<Database> | Transaction<Database>;

export const exec = (trx?: Executor) => trx ?? db;

type newExpense = {
    user_id: number;
    description: string;
    amount: number;
    date: Date;
};

type updateExpense = {
    id: number;
    description?: string;
    amount?: number | undefined;
    date?: Date | undefined;
};

// @param      id - number
// @returns    expense - ExpensesTable
// @notes      returns an expense for a certain id
export const getExpenseById = async (id: number, trx?: Executor) => {
    return await exec(trx)
        .selectFrom("expenses")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirstOrThrow();
};

// @param      id - number
// @returns    expense - ExpensesTable[]
// @notes      returns an expense for a certain id
export const getAllExpenses = async (trx?: Executor) => {
    return await exec(trx).selectFrom("expenses").selectAll().execute();
};

// @param      user_id - number
// @returns    expenses - ExpensesTable[]
// @notes      returns an expense for a certain id
export const getExpensesByUserId = async (user_id: number, trx?: Executor) => {
    return await exec(trx)
        .selectFrom("expenses")
        .selectAll()
        .where("user_id", "=", user_id)
        .execute();
};

// @param      info - all info
// @returns    expense - ExpensesTable
// @notes      updates an expense for a certain id
export const updateExpenseById = async (
    info: updateExpense,
    trx?: Executor
) => {
    return await exec(trx)
        .updateTable("expenses")
        .set((eb) => ({
            description: info.description ?? eb.ref("description"),
            amount: info.amount ?? eb.ref("amount"),
            date: info.date! ?? eb.ref("date"),
            updated_at: new Date(),
        }))
        .where("id", "=", info.id)
        .returningAll()
        .executeTakeFirstOrThrow();
};

// @param      id - number
// @returns    expense - ExpensesTable
// @notes      deletes an expense for a certain id
export const deleteExpenseById = async (id: number, trx?: Executor) => {
    return await exec(trx)
        .deleteFrom("expenses")
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();
};

// @param      info - object
// @returns    expense - ExpensesTable
// @notes      creates an expense
export const createExpense = async (info: newExpense, trx?: Executor) => {
    return await exec(trx)
        .insertInto("expenses")
        .values({
            ...info,
            created_at: new Date(),
            updated_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
};
