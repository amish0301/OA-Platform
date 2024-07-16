import express from 'express';
import authRoutes from './routes/auth.route.js';

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URI,
}))

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port ', process.env.PORT || 5000);
})