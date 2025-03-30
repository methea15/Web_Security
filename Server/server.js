import express from "express";
import { database } from "./config/database.js";
import dotenv from "dotenv";
import router from "./router.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", router);

app.listen(3000, () => {
    database();
    console.log("Server started at http://localhost:3000");

})