import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

config();
const app = express();

const allowedOrigins = [
  'https://fitgptfrontend.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log(`CORS request from origin: ${origin}`);
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middlewares
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