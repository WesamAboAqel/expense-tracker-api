import express from "express";
import { getUsers, signup } from "../controllers/user.controller.js";
import { authentication } from "../middleware/jwt.js";

const router = express.Router();

router.get("/getall", authentication, getUsers);

router.post("/signup", signup);

export default router;
