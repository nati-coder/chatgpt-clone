import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/api/auth/auth.routes.js';
import chatRoutes from './src/api/chat/chat.routes.js';
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server active on port ${PORT}`));