import authModel from "../models/authModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user =
            await authModel.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,

            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const workerLogin = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user =
            await authModel.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.role !== "professional") {
            return res.status(403).json({
                message: "This account is not a worker account"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Worker login successful",
            token,

            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Worker login error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export {
    login,
    workerLogin
};