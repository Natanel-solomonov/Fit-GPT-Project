import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
const cors = require("cors")
<<<<<<< HEAD
import bodyParser from 'body-parser'
=======
import bodyParser from 'body-parser';

>>>>>>> ed915ec91b55762e9726fdb21bd7f5d6bdbbf3b4
config();
const app = express();

// Configure CORS options

app.use(
  cors({
<<<<<<< HEAD
    orgin: "https://fit-gpt-frontend.onrender.com"
=======
    origin: "https://fit-gpt-frontend.onrender.com"
>>>>>>> ed915ec91b55762e9726fdb21bd7f5d6bdbbf3b4
  })
)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Remove it in production
app.use(morgan('dev'));

app.use('/api/v1', appRouter);

app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS configuration is working' });
});

export default app;
