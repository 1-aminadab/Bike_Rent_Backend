import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import {
  NextFunction, Request, RequestHandler, Response
} from 'express';

function validationMiddleware<T>(type: any):RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(type, req.body);
    validate(dtoObject).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const messages = errors.map(
          (error: ValidationError) => Object.values(error.constraints).join(',')
        );
        res.status(400).json({ errors: messages });
      } else {
        req.body = dtoObject;
        next();
      }
    });
  };
}
 
export default validationMiddleware;
