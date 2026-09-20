import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js'
import bookingRoutes from './routes/bookingRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

import reportRoutes from './routes/reportRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import verificationRoutes from './routes/verificationRoutes.js'


import authRoutes from './routes/authRoutes.js';
import professionalRoutes from './routes/professionalRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import servicesRoutes from './routes/servicesRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/payments', paymentRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/verifications', verificationRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', servicesRoutes);


app.get('/', (req, res) => {
    res.send('Your backend server is running successfully!');
});


app.get('/api/health', async (req, res) => {
    try {
        const [result] = await db.query(
            'SELECT 1 as connected'
        );

        res.json({
            success: true,
            database: result[0].connected === 1
        });

    } catch (error) {
        console.error(
            'Database connection failed',
            error
        );

        res.status(500).json({
            success: false,
            database: false
        });
    }
});


app.listen(PORT, () => {
    console.log(
        `Server is running smoothly on port ${PORT}`
    );
});