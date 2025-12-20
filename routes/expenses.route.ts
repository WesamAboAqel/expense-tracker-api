import express from "express";
import { authentication } from "../middleware/jwt.js";
import {
    addExpenseC,
    deleteExpenseC,
    getExpenseByIdC,
    getUserExpensesC,
    updateExpenseC,
} from "../controllers/expenses.controller.js";

const router = express.Router();

router.get("/user", authentication, getUserExpensesC);
router.put("/:id", authentication, updateExpenseC);
router.delete("/:id", authentication, deleteExpenseC);
router.post("/add", authentication, addExpenseC);
router.get("/:id", authentication, getExpenseByIdC);

export default router;
