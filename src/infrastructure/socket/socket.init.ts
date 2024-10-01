/* eslint-disable no-console */
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { rateLimiterMiddleware } from '../middleware/request-middleware';
import { userService } from '../../application/service/user.service';
import { TokenManager } from '../utils/token-manager';
import { parse } from 'cookie'; // Library to parse cookies

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const validateUserId = (userId: string): boolean => typeof userId === 'string' && userId.length > 0;

export const userSockets: Map<string, string> = new Map();

export class SocketInitializer {
  protected io: Server;
  // Initializes the Socket.IO server with HTTP server and CORS options.
  initializeSocket(httpServer: any, corsOptions: any): Server {
    this.io = new Server(httpServer, { cors: corsOptions });

    // Apply rate limiter middleware
    this.io.use(rateLimiterMiddleware);
    console.log('====================================');
    console.log("after the rate limmiter");
    console.log('====================================');
    // Listen for new connections
    this.io.on('connection', async (socket: Socket) => {
      console.log('====================================');
      console.log("here we go again");
      console.log('====================================');
      
      const connectionTime = new Date().toISOString();
      console.log(`[${connectionTime}] New connection: ${socket.id}`);

      try {
        // Extract cookies from the headers
        const cookieHeader = socket.handshake.headers.cookie;
        if (!cookieHeader) {
          throw new Error('No cookies found');
        }

        // Parse the cookies to extract the accessToken
        const cookies = parse(cookieHeader);
        const accessToken = cookies.accessToken;

        if (!accessToken) {
          throw new Error('No access token found in cookies');
        }

        console.log(`[${connectionTime}] Access token found for socket ID ${socket.id}: ${accessToken}`);

        // Verify the token and register the user
        const { user } = await TokenManager.verifyAccessToken(accessToken);
        const newUserId = user._id;
        const userData = await userService.getUserById(newUserId);

        if (!userData) {
          throw new Error('Invalid token');
        }

        if (validateUserId(newUserId)) {
          userSockets.set(newUserId, socket.id);
          console.log(`[${connectionTime}] User ${newUserId} registered with socket ID ${socket.id}`);
        } else {
          throw new Error('Invalid user ID');
        }

      } catch (error) {
        const errorMessage = error.message || 'Unknown error during connection';
        console.error(`[${connectionTime}] Error: ${errorMessage}`);
        socket.emit('error', errorMessage);
        socket.disconnect();
      }

      // Log all incoming messages (for better traceability)
      socket.onAny((event, ...args) => {
        const eventTime = new Date().toISOString();
        console.log(`[${eventTime}] Incoming event from socket ID ${socket.id}: ${event}, args: ${JSON.stringify(args)}`);
      });

      // Listen for 'disconnect' event
      socket.on('disconnect', (reason: string) => {
        const disconnectTime = new Date().toISOString();
        console.log(`[${disconnectTime}] Socket ID ${socket.id} disconnected. Reason: ${reason}`);

        userSockets.forEach((value, key) => {
          if (value === socket.id) {
            userSockets.delete(key);
            console.log(`[${disconnectTime}] User ${key} disconnected and removed from map`);
          }
        });
      });

      // Example of sending a message to the client
      socket.emit('message', 'Welcome to the server!');
      console.log(`[${connectionTime}] Welcome message sent to socket ID ${socket.id}`);
    });

    return this.io;
  }
}
