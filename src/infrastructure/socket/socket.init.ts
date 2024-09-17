// /* eslint-disable no-console */
// import { Server, Socket } from 'socket.io';
// import dotenv from 'dotenv';
// import { TokenService } from '../auth/token-service';
// import { rateLimiterMiddleware } from '../middleware/request-middleware';
// import { UserController } from '../controllers/user/user.conroller';
// import { concatUserId } from '../utils/common.utils';

// dotenv.config();
// const SECRET_KEY = process.env.JWT_SECRET_KEY;

// // Validates if a userId is a non-empty string.
// export const validateUserId = (userId: string): boolean => typeof userId === 'string' && userId.length > 0;

// // A Map to store user IDs and their corresponding socket IDs.
// export const userSockets: Map<string, string> = new Map();

// const tokenService = new TokenService();
// const userController = new UserController();

// export class SocketInitializer {
//   protected io: Server;

//   // Initializes the Socket.IO server with HTTP server and CORS options.
//   initializeSocket(httpServer: any, corsOptions: any): Server {
//     this.io = new Server(httpServer, { cors: corsOptions });

//     this.io.use(rateLimiterMiddleware);

//     // Listen for new connections
//     this.io.on('connection', (socket: Socket) => {
//       console.log(`New connection: ${socket.id}`);

//       // Listen for 'register' event
//       socket.on('register', async (token: string): Promise<void> => {
//         try {
//           const { user_id: userId, from } = await tokenService.verifyToken(token);
//           const newUserId = concatUserId(userId, from);
//           const userData = await userController.findUserById(newUserId);
//           const hashedToken = userData?.hashedData;
//           if (!hashedToken) {
//             throw new Error('Invalid token or user data');
//           }

//           const salt = 16;
//           const isTokenValid = await tokenService.verifyHashedToken(salt, hashedToken, token);
//           if (!isTokenValid) {
//             throw new Error('Invalid token');
//           }

//           if (validateUserId(newUserId)) {
//             userSockets.set(newUserId, socket.id);
//             console.log(`User ${userId} registered with socket ID ${socket.id}`);
//           } else {
//             socket.emit('error', 'Invalid user ID');
//           }
//         } catch (error) {
//           console.error('Error during socket registration:', error.message);
//           socket.emit('error', error.message);
//         }
//       });

//       // Ignore all incoming messages from the client
//       socket.onAny((event, ...args) => {
//         console.log(`Ignoring client event: ${event}`);
//       });

//       // Listen for 'disconnect' event
//       socket.on('disconnect', () => {
//         userSockets.forEach((value, key) => {
//           if (value === socket.id) {
//             userSockets.delete(key);
//             console.log(`User ${key} disconnected and removed from map`);
//           }
//         });
//       });

//       // Example of sending a message to the client
//       socket.emit('message', 'Welcome to the server!');
//     });

//     return this.io;
//   }
// }
