/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { io } from '../../server';
import rentalModel, {IRental} from '../models/rental.model';
import { SocketInitializer, userSockets } from './socket.init';

import { logger } from '../../logger';


export class NotificationController extends SocketInitializer {
  public async sendRental(rental: IRental ):Promise<any> {
    const receiverIds = [rental.assigned_by]

    receiverIds.forEach(async (receiver:any) => {
      const recipientSocketId = userSockets.get(receiver);
      logger.info('Socket rental', rental);

      if (recipientSocketId) {
        try {
        
          io.to(recipientSocketId).emit('rental', rental);
        } catch (error) {
          console.error(`Failed to send notification to user ${receiver}: ${error.message}`);
        }
      } else {
        console.log(`No active socket for user ${receiver}`);
      }
    });
  }

  public async sendNotificationToAllUsers(notification: Notification) {
    try {
      io.emit('notification', notification);
      console.log('Notification sent to all users');
    } catch (error) {
      console.error('Failed to send notification to all users:', error.message);
    }
  }
}
