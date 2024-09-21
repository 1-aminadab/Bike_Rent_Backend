import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import { ApplicationError } from './domain/errors/application-error';

export const app = express();

// CORS configuration with whitelist
// const whitelist = ['http://localhost:5173'];
// const corsOptions: any = {
//   origin: (origin:any, callback:any) => {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// };

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err : undefined,
    message: err.message
  });
});
