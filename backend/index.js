import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Your backend server is running successfully!');
});

// Database health check
app.get('/api/health', async (req, res) => {
    try {
        const [result] = await db.query('SELECT 1 as connected');

        res.json({
            success: true,
            database: result[0].connected === 1
        });
    } catch (error) {
        console.error('Database connection failed', error);

        res.status(500).json({
            success: false,
            database: false
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});