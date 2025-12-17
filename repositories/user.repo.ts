import db from "../services/db.js";
import { UserTable } from "../database/schema.js";

type newUser = {
    name: string;
    username: string;
    password: string;
};

// @returns    users array - UserTable[]
// @notes      List of users in array, empty array if none exist
export const getAllUsers = async () => {
    return await db.selectFrom("user").selectAll().execute();
};

// @param      data - newUser
// @returns    user - UserTable
// @notes      Adds a user and returns it
export const createUser = async (data: newUser) => {
    return await db
        .insertInto("user")
        .values({
            ...data,
            created_at: new Date(),
            updated_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
};

// @param      id - number
// @returns    user - UserTable
// @notes      get user by id
export const getUserById = async (id: number) => {
    return await db
        .selectFrom("user")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
};

// @param      username - string
// @returns    user - UserTable
// @notes      get user by username
export const getUserByUsername = async (username: string) => {
    return await db
        .selectFrom("user")
        .selectAll()
        .where("username", "=", username)
        .executeTakeFirst();
};
