import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
config();
const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';
// Define allowed origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://fit-gpt-frontend.onrender.com",
    "https://www.fitsgpt.com"
];
// Configure CORS options dynamically
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// Remove it in production
app.use(morgan('dev'));
app.use('/api/v1', appRouter);
export default app;
//# sourceMappingURL=app.js.map