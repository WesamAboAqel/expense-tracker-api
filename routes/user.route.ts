import express from "express";
import { getUsers, login, signup } from "../controllers/user.controller.js";
import { authentication, generateTokens } from "../middleware/jwt.js";
import { checkPassword } from "../middleware/bcrypt.js";

const router = express.Router();

router.get("/getall", authentication, getUsers);

router.post("/signup", signup);

router.post("/login", login, checkPassword, generateTokens);

export default router;
