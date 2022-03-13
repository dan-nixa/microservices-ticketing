import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('error description', err);
    console.log('Instanceof CustomError', err instanceof CustomError);

    if (err instanceof CustomError) {
        return res
            .status(err.statusCode)
            .send({ errors: err.serializeErrors() });
    }
};

// STANDARD ERROR FORMAT
// {
//     errors: {
//         message: string,
//         field?: string
//     }[]
// }
