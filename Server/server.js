import express from "express";
import { database } from "./config/database.js";
import dotenv from "dotenv";
import router from "./router.js";
import cors from 'cors';
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 5050;
const app = express(); 
const __dirname = path.resolve();


app.use(cors({origin: "http://localhost:5173", credentials:true}));
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});


app.listen(PORT, () => {
    database();
    console.log(`Server started at http://localhost:${PORT}`);

})