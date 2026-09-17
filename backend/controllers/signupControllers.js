import authModel from "../models/authModels.js";
import bcrypt from "bcrypt";


const signup = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password
        } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields"
            });
        }

        const existingUser =
            await authModel.getUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const password_hash =
            await bcrypt.hash(password, 10);

        const userId =
            await authModel.createUser(
                first_name,
                last_name,
                email,
                password_hash,
                "customer"
            );

        return res.status(201).json({
            message: "Signup successful",
            user: {
                user_id: userId,
                first_name,
                last_name,
                email,
                role: "customer"
            }
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const workerSignup = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password
        } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields"
            });
        }

        const existingUser =
            await authModel.getUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const password_hash =
            await bcrypt.hash(password, 10);

        const userId =
            await authModel.createUser(
                first_name,
                last_name,
                email,
                password_hash,
                "professional"
            );

        const professionalId =
            await authModel.createProfessional(userId);

        return res.status(201).json({
            message: "Worker signup successful",

            user: {
                user_id: userId,
                first_name,
                last_name,
                email,
                role: "professional"
            },

            professional: {
                professional_id: professionalId
            }
        });

    } catch (error) {
        console.error("Worker signup error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export {
    signup,
    workerSignup
};