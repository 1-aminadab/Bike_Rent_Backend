/* eslint-disable import/first */
/* eslint-disable import/no-mutable-exports */
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import authRouter from './presentation/routes/auth.routes';
import userRouter from './presentation/routes/user.routes';
import rentalRouter from './presentation/routes/rental.routes';
import { app } from './app';
import MongoConnection from './mongo-connection';
import { logger } from './logger';
import { SocketInitializer } from './infrastructure/socket/socket.init';

export let io: Server | null = null;

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env' });
}

const initializeSocket = new SocketInitializer();

const mongoConnection = new MongoConnection(process.env.MONGO_URL);

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};
app.use(cors(corsOptions));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/rental', rentalRouter);

if (process.env.MONGO_URL == null) {
  logger.log({

    level: 'error',
    message: 'MONGO_URL not specified in environment'
  });
  process.exit(1);
} else {
  mongoConnection.connect(() => {
    const server = http.createServer(app);
    io = initializeSocket.initializeSocket(server, corsOptions);
    app.listen(app.get('port'), (): void => {
      console.log('\x1b[36m%s\x1b[0m', // eslint-disable-line
        `🌏 Express server started at http://localhost:${app.get('port')}`
      );
    });
  });
}

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', () => {
  logger.info('Gracefully shutting down');
  mongoConnection.close(true);
});
