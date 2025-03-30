import express from "express";
import { createHistory, deleteHistory, getHistory, updateHistory } from "./controller/history.js";
import { createUser, deleteUser, getUser, updateUser } from "./controller/user.js";
import { createURL, deleteURL, getURL, updateURL } from "./controller/url.js";

const router = express.Router();

//histories
router.get("/history", getHistory);
router.post("/history", createHistory);
router.put("/history/:id", updateHistory);
router.delete("/history/:id", deleteHistory);

//user
router.get("/user", getUser);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

//url
router.get("/url", getURL);
router.post("/url", createURL);
router.put("/url/:id", updateURL);
router.delete("/url/:id", deleteURL);

export default router;