import { Generated } from "kysely";
import { VariableDeclaration } from "typescript";

export interface UserTable {
    id: Generated<number>;
    name: string;
    username: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

export interface SessionTable {
    id: Generated<number>;
    user_id: number;
    refresh_token_hash: string;
    created_at: Date;
    expires_at: Date;
    revoked_at: Date | null;
}

export interface ExpensesTable {
    id: Generated<number>;
    user_id: number;
    description: string;
    amount: number;
    date: Date;
    category: string;
    created_at: Date;
    updated_at: Date;
}

export interface Database {
    user: UserTable;
    sessions: SessionTable;
    expenses: ExpensesTable;
}
