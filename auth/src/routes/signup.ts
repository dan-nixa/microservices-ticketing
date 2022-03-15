import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';

import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
    '/api/users/signup',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 6, max: 20 })
            .withMessage('Password must be between 6 and 20 characters'),
        // validator will add messages to the request, which you can then pull off of the request and send back to the user
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }
        const { email, password } = req.body;

        // query db to see if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('Email in use');
            throw new BadRequestError('Email in use');
        }

        // hash password - skip for now

        // create new User
        const user = User.build({ email, password });
        // persist to db
        await user.save();

        // send back authentication
        res.status(201).send(user);
    }
);

export { router as signupRouter };
