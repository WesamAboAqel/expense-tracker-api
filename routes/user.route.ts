import express from "express";
import {
    getUsers,
    signup,
    signUpEmail,
} from "../controllers/user.controller.js";
import { authentication } from "../middleware/jwt.js";

const router = express.Router();

router.get("/getall", authentication, getUsers);

router.post("/signup", signup, signUpEmail);

export default router;
