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

    
        const existingUser = await authModel.getuserbyemail(email);

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const userId = await authModel.createUser(
            first_name,
            last_name,
            email,
            password_hash
        );

        res.status(201).json({
            message: "Signup successful",
            user: {
                user_id: userId,
                first_name: first_name,
                last_name: last_name,
                email: email,
                role: "customer"
            }
        });

    } catch (error) {
        console.error("Signup error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export { signup };
