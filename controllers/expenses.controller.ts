import { Request, Response } from "express";
import {
    createExpense,
    deleteExpenseById,
    getExpenseById,
    getExpensesByUserId,
    updateExpenseById,
} from "../repositories/expenses.repo.js";

// @desc    get all expenses for user
// @route   GET /api/expenses/user/:user_id
// @access  Private
export const getUserExpensesC = async (
    request: Request,
    response: Response
): Promise<void> => {
    try {
        const user_id = response.locals.payload.user_id;

        const expenses = await getExpensesByUserId(user_id);

        response.status(200).json(expenses);
    } catch (error) {
        response.status(404).json({ msg: "Failed to get expenses" });
    }
};

// @desc    update expense by id
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpenseC = async (
    request: Request,
    response: Response
): Promise<void> => {
    try {
        const id = parseInt(request.params.id!);

        const info = {
            id,
            description: request.body.description,
            amount:
                request.body.amount !== undefined
                    ? Number(request.body.amount)
                    : undefined,
            date:
                request.body.date !== undefined
                    ? new Date(request.body.amount)
                    : undefined,
        };

        const newExpense = await updateExpenseById(info);

        response.status(200).json(newExpense);
    } catch (error) {
        response.status(404).json({ msg: "Failed to update expense" });
    }
};

// @desc    delete expense by id
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpenseC = async (
    request: Request,
    response: Response
): Promise<void> => {
    try {
        const id = parseInt(request.params.id!);

        await deleteExpenseById(id);

        response
            .status(200)
            .json({ msg: `Successfully deleted Expense with the Id: ${id}` });
    } catch (error) {
        response.status(404).json({ msg: "Failed to delete expense" });
    }
};

// @desc    create expense
// @route   POST /api/expenses/add
// @access  Private
export const addExpenseC = async (
    request: Request,
    response: Response
): Promise<void> => {
    try {
        // console.log(response.locals.payload);
        const info = {
            user_id: parseInt(response.locals.payload.user_id),
            description: request.body.description,
            amount: parseInt(request.body.amount),
            date: new Date(request.body.date),
        };

        // console.log(info);

        const expense = await createExpense(info);
        // console.log(expense);

        response.status(201).json(expense);
    } catch (error) {
        response.status(404).json({ msg: "Failed to add expense" });
    }
};

// @desc    get expense by id
// @route   GET /api/expenses/:id
// @access  Private
export const getExpenseByIdC = async (
    request: Request,
    response: Response
): Promise<void> => {
    try {
        const id = parseInt(request.params.id!);

        const expense = await getExpenseById(id);

        response.status(200).json(expense);
    } catch (error) {
        response.status(404).json({ msg: "Failed to get expense" });
    }
};
