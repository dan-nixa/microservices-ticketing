import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session?.jwt) {
        return next();
    }

    try {
        const payload = jwt.verify(
            req.session?.jwt,
            process.env.JWT_KEY!
        ) as UserPayload;
        req.currentUser = payload;
    } catch (err) {}
    next();
};

// purpose of this middleware is to check if a given user is logged in. if not, we simple call next(), if so, then we add a property to the req object called currentUser to be used by other middlewares in the app

// req.currentUser throwing a ts error.
// we defined UserPayload interface, now we are going to tell ts that a req object should have a currentUser property and is of type UserPayload

/*
// declare global {
    namespace Express {}
}

declare global ---> lets you declare global variables from within a module. a file that has import/export is a module. Anything declared within a module is in the modual scope. 'declare global' lets you declare global variables from within a module.  library that can be accessed from the global scope (i.e., without an import). 

thus, our declare global statement above reaches into the global namespace (Express) from this module and adds an optional property to the Request interface

*/
