import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import { ApplicationError } from './domain/errors/application-error';
import authRouter from './presentation/routes/auth.routes';
import userRouter from './presentation/routes/user.routes';
// import routeRouter from './presentation/routes/route.routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bikeRouter from './presentation/routes/bike.routes';
import PaymentRouter from './presentation/routes/payment.routes';
import TrackingRouter from './presentation/routes/tracking.routes';
import RentalRouter from './presentation/routes/rental.routes';
import HistoryRouter from './presentation/routes/history.routes';
import routeRouter from './presentation/routes/route.routes';
import placeRouter from './presentation/routes/place.routes';
import priceRouter from './presentation/routes/price.routes';

export const app = express();
app.use(cookieParser());

// CORS configuration with whitelist
const corsOptions: any = {
  origin: (origin: any, callback: any) => {
    // Allow requests from any origin
    callback(null, true);
  },
  credentials: true, // Allows credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions)); 

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/bike',bikeRouter);
app.use('/api/payment', PaymentRouter);
app.use('/api/tracking', TrackingRouter);
app.use('/api/rental', RentalRouter);
app.use('/api/history', HistoryRouter);
app.use('/api/route', routeRouter);
app.use('/api/place', placeRouter);
app.use('/api/price', priceRouter);

app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err : undefined,
    message: err.message
  });
});
