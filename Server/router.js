import express from "express";
import { createHistories, deleteHistories, getHistories, updateHistories } from "./controller/history.js";
import { checking, deleteUser, getUser, logIn, logOut, signUp, updateUser, verifyToken } from "./controller/user.js";
import { checkingUrl } from "./controller/url.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const limiter = rateLimit({
    windowMs: 20 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false
});
//histories
router.get("/histories", getHistories);
router.post("/histories", limiter, createHistories);
router.put("/histories/:id",limiter, updateHistories);
router.delete("/histories/:id",limiter, deleteHistories);

//url
router.post("/url", limiter, checkingUrl);

//user
router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);
//not working
router.get("/checking", verifyToken, checking);
router.get("/user", verifyToken, getUser);
router.put("/user/:id", verifyToken, updateUser);
router.delete("/user/:id", verifyToken, deleteUser);


export default router;