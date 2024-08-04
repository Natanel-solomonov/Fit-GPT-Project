import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';

config();
const app = express();

// Set CORS headers manually
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://fitgptfrontend.onrender.com");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader("Access-Control-Allow-Credentials", "true");  // Ensure the value is a string
  res.setHeader("Access-Control-Allow-Private-Network", "true");  // Ensure the value is a string
  res.setHeader("Access-Control-Max-Age", "7200"); // Ensure the value is a string

  next();
});

// Handle preflight requests
app.options("*", (req, res) => {
  if (
    req.headers.origin === "https://fitgptfrontend.onrender.com" &&
    ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS", "CONNECT", "TRACE"].includes(req.headers["access-control-request-method"]) &&
    ["Content-Type", "Authorization", "X-Content-Type-Options", "Accept", "X-Requested-With", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"].includes(req.headers["access-control-request-headers"])
  ) {
    return res.status(204).send();
  } else {
    return res.status(403).send('Forbidden');
  }
});

// Health check endpoint
app.get("/healthz", (req, res) => {
  return res.status(204).send();
});

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Remove it in production
app.use(morgan('dev'));

app.use('/api/v1', appRouter);

app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS configuration is working' });
});

export default app;
