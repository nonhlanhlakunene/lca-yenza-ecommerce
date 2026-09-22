import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";

import { login, workerLogin} from "../controllers/authControllers.js";

import { signup, workerSignup} from "../controllers/signupControllers.js";


const router = express.Router();


router.post("/login", login);
router.post("/signup", signup);
router.post("/worker-login", workerLogin);
router.post("/worker-signup", workerSignup);

export default router;