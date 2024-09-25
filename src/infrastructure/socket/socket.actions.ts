/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { io } from '../../server';
import rentalModel, { IRental } from '../models/rental.model';
import { SocketInitializer, userSockets } from './socket.init';
import { logger } from '../../logger';

export class sendRentalToSubAdmin extends SocketInitializer {
  
  // Sends rental information to a specific user (Sub-admin)
  public async sendRental(rental: IRental): Promise<any> {
    const receiverIds = [rental.assigned_by];

    receiverIds.forEach(async (receiver: any) => {
      const recipientSocketId = userSockets.get(receiver);
      logger.info(`Preparing to send rental info to user ${receiver}`, { rental });

      if (recipientSocketId) {
        try {
          io.to(recipientSocketId).emit('rental', rental);
          logger.info(`Rental info sent to user ${receiver} on socket ${recipientSocketId}`, { rental });
        } catch (error) {
          logger.error(`Failed to send rental info to user ${receiver} on socket ${recipientSocketId}`, { error: error.message });
        }
      } else {
        logger.warn(`No active socket for user ${receiver}`);
      }
    });
  }

  // Sends the ride status to a specific user
  public async sendRideStatus(assignedTo: string, status: string): Promise<any> {
    const receiverIds = [assignedTo];

    receiverIds.forEach(async (receiver: any) => {
      const recipientSocketId = userSockets.get(receiver);
      logger.info(`Preparing to send ride status to user ${receiver}`, { status });

      if (recipientSocketId) {
        try {
          io.to(recipientSocketId).emit('status', status);
          logger.info(`Ride status sent to user ${receiver} on socket ${recipientSocketId}`, { status });
        } catch (error) {
          logger.error(`Failed to send ride status to user ${receiver} on socket ${recipientSocketId}`, { error: error.message });
        }
      } else {
        logger.warn(`No active socket for user ${receiver}`);
      }
    });
  }

  // Sends location tracking status to a specific user
  public async trackLocation(assignedTo: string): Promise<any> {
    const receiverIds = [assignedTo];

    receiverIds.forEach(async (receiver: any) => {
      const recipientSocketId = userSockets.get(receiver);
      logger.info(`Preparing to track location for user ${receiver}`);

      if (recipientSocketId) {
        try {
          io.to(recipientSocketId).emit('status', 'Tracking location...');
          logger.info(`Location tracking initiated for user ${receiver} on socket ${recipientSocketId}`);
        } catch (error) {
          logger.error(`Failed to track location for user ${receiver} on socket ${recipientSocketId}`, { error: error.message });
        }
      } else {
        logger.warn(`No active socket for user ${receiver}`);
      }
    });
  }

  // Sends a notification to all connected users
  public async sendNotificationToAllUsers(notification: Notification): Promise<void> {
    try {
      io.emit('notification', notification);
      logger.info('Notification sent to all connected users', { notification });
    } catch (error) {
      logger.error('Failed to send notification to all users:', { error: error.message });
    }
  }
}
