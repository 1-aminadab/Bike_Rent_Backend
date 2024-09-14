import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import { ApplicationError } from './domain/errors/application-error';
import authRouter from './presentation/routes/auth.routes';
import userRouter from './presentation/routes/user.routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bikeRouter from './presentation/routes/bike.routes';
import PaymentRouter from './presentation/routes/payment.routes';

export const app = express();
app.use(cookieParser());

// CORS configuration with whitelist
const whitelist = ['http://localhost:5173'];
const corsOptions: any = {
  origin: (origin:any, callback:any) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// app.use(cors(corsOptions));  
app.use(cors({
  origin: corsOptions, // Frontend URL
  credentials: true, // Allows credentials (cookies, authorization headers, etc.)
}));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/bike',bikeRouter);
app.use('/api/payment', PaymentRouter);

app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err : undefined,
    message: err.message
  });
});
