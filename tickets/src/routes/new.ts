import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@dbtix/microserv-common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
    '/api/tickets',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is requied'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('price must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        try {
            const ticket = Ticket.build({
                title,
                price,
                userId: req.currentUser!.id,
            });

            await ticket.save();
            res.status(201).send(ticket);
        } catch (e) {
            console.log('hit error trying to save doc', e);
        }
    }
);

export { router as createTicketRouter };

// building up request incrementally based on tests...
