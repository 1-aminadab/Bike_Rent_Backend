import {
  RequestHandler, Request, Response, NextFunction
} from 'express';
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Socket } from 'socket.io';
import { BadRequest, UnauthorizedRequest } from '../errors';
import { logger } from '../../logger';

const getMessageFromJoiError = (error: Joi.ValidationError): string | undefined => {
  if (!error.details && error.message) {
    return error.message;
  }
  return error.details && error.details.length > 0 && error.details[0].message
    ? `PATH: [${error.details[0].path}] ;; MESSAGE: ${error.details[0].message}` : undefined;
};

interface HandlerOptions {
  validation?: {
    body?: Joi.ObjectSchema
  },
  skipJwtAuth?: boolean
};

/**
 * This router wrapper catches any error from async await
 * and throws it to the default express error handler,
 * instead of crashing the app
 * @param handler Request handler to check for error
 */
export const relogRequestHandler = (
  handler: any,
  options?: HandlerOptions,
): RequestHandler => async (req: Request, res: Response, next: NextFunction) => {
  logger.log({
    level: 'info',
    message: req.url
  });
  if (!options?.skipJwtAuth) {
    const token = req.headers['authorization'];

    if (token) {
      // eslint-disable-next-line consistent-return
      jwt.verify(token.replace('Bearer ', '').replace('Bearer', ''), process.env.SECRET, (err, decoded) => {
        if (err) {
          logger.log({
            level: 'info',
            message: 'Token Validation Failed'
          });
          return next(new UnauthorizedRequest());
        }
      });
    } else {
      logger.log({
        level: 'info',
        message: 'Auth token is not supplied'
      });
      return next(new UnauthorizedRequest('Auth token is not supplied'));
    }
  }
  if (options?.validation?.body) {
    const { error } = options?.validation?.body.validate(req.body);
    if (error != null) {
      return next(new BadRequest(getMessageFromJoiError(error)));
    }
  }

  return handler(req, res, next).catch((err: Error) => {
    if (process.env.NODE_ENV === 'development') {
      logger.log({
        level: 'error',
        message: 'Error in request handler',
        error: err
      });
    }
    next(err);
  });
};

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 1
});

export const rateLimiterMiddleware = (socket: Socket, next: (err?: any) => void) => {
  rateLimiter.consume(socket.handshake.address)
    .then(() => {
      next();
    })
    .catch(() => {
      console.warn(`Rate limit exceed form ${socket.handshake.address}`);
      next(new Error('Rate limit exceeded'));
    });
};
