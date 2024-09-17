// /* eslint-disable no-console */
// /* eslint-disable no-await-in-loop */
// import { io } from '../../server';
// import { Notification } from '../types';
// import { SocketInitializer, userSockets } from './socket.init';
// import { concatUserId } from '../utils/common.utils';
// import { NotificationDocument, NotificationModel } from '../models/notification.model';
// import { UserId } from '../types/notification.type';
// import { logger } from '../../logger';


// export class NotificationController extends SocketInitializer {
//   public async sendNotification(notification: Notification | NotificationDocument):Promise<any> {
//     const receiverIds = notification.context.user_id;

//     receiverIds.forEach(async (receiver:UserId) => {
//       const { user_id: userId, from } = receiver;
//       const newUserId = concatUserId(userId, from);
//       const recipientSocketId = userSockets.get(newUserId);
//       logger.info('Socket notification', notification);

//       if (recipientSocketId) {
//         try {
        
//           io.to(recipientSocketId).emit('notification', notification);
//         } catch (error) {
//           console.error(`Failed to send notification to user ${userId}: ${error.message}`);
//         }
//       } else {
//         console.log(`No active socket for user ${userId}`);
//       }
//     });
//   }

//   public async sendNotificationToAllUsers(notification: Notification) {
//     try {
//       io.emit('notification', notification);
//       console.log('Notification sent to all users');
//     } catch (error) {
//       console.error('Failed to send notification to all users:', error.message);
//     }
//   }
// }
