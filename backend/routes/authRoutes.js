import express from "express";

import {
  login,
  workerLogin,
  getVerificationStatus,
} from "../controllers/authControllers.js";
import { signup, workerSignup } from "../controllers/signupControllers.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/worker-login", workerLogin);
router.post("/worker-signup", workerSignup);

router.get("/verification-status", getVerificationStatus);

export default router;
