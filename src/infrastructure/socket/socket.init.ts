import { IUser } from '../../domain/interface/user.interface';
/* eslint-disable no-console */
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { rateLimiterMiddleware } from '../middleware/request-middleware';
import { userService } from '../../application/service/user.service';
import { TokenManager } from '../utils/token-manager';
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const validateUserId = (userId: string): boolean => typeof userId === 'string' && userId.length > 0;

export const userSockets: Map<string, string> = new Map();


export class SocketInitializer {
  protected io: Server;

  // Initializes the Socket.IO server with HTTP server and CORS options.
  initializeSocket(httpServer: any, corsOptions: any): Server {
    this.io = new Server(httpServer, { cors: corsOptions });

    this.io.use(rateLimiterMiddleware);

    // Listen for new connections
    this.io.on('connection', (socket: Socket) => {
      console.log(`New connection: ${socket.id}`);

      // Listen for 'register' event
      socket.on('register', async (token: string): Promise<void> => {
        try {
          const { user } = await TokenManager.verifyAccessToken(token)
          const newUserId = user._id
          const userData = await userService.getUserById(newUserId)     
          if (!userData) {
            throw new Error('Invalid token');
          }

          if (validateUserId(newUserId)) {
            userSockets.set(newUserId, socket.id);
            console.log(`User ${newUserId} registered with socket ID ${socket.id}`);
          } else {
            socket.emit('error', 'Invalid user ID');
          }
        } catch (error) {
          console.error('Error during socket registration:', error.message);
          socket.emit('error', error.message);
        }
      });

      // Ignore all incoming messages from the client
      socket.onAny((event, ...args) => {
        console.log(`Ignoring client event: ${event}`);
      });

      // Listen for 'disconnect' event
      socket.on('disconnect', () => {
        userSockets.forEach((value, key) => {
          if (value === socket.id) {
            userSockets.delete(key);
            console.log(`User ${key} disconnected and removed from map`);
          }
        });
      });

      // Example of sending a message to the client
      socket.emit('message', 'Welcome to the server!');
    });

    return this.io;
  }
}
