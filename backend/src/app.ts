import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

config();
const app = express();

const allowedOrigins = [
  "https://fitgptfrontend.onrender.com",
  "http://localhost:5173"
];

const corsOptions = {
  origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS", "CONNECT", "TRACE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Content-Type-Options", "Accept", "X-Requested-With", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"],
  credentials: true,
  maxAge: 7200
};

// Use CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Remove it in production
app.use(morgan('dev'));

app.use('/api/v1', appRouter);

app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS configuration is working' });
});

export default app;
