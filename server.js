import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './src/routes/auth.js';
import rideRoutes from './src/routes/rides.js';
import { startCronJobs } from './cron.js'; // import your cron
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.error(err));

app.get('/', (req, res) => res.send('API OK'));
startCronJobs();
app.use('/auth', authRoutes);
app.use('/rides', rideRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
