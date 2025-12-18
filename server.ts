import express from "express";
import users from "./routes/user.route.js";
import auth from "./routes/auth.route.js";
import expenses from "./routes/expenses.route.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/error_handler.js";

const app = express();

app.use(express.json());

app.use(logger);

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/expenses", expenses);

app.use(errorHandler);

app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running and listening to port: 3000");
});
