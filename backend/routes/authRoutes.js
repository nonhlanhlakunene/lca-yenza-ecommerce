import express from "express";
import { login } from "../controllers/authControllers.js";
import { signup } from "../controllers/signupControllers.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

export default router;
