import {
    NotFoundError,
    requireAuth,
    OrderStatus,
    BadRequestError,
} from '@dbtix/microserv-common';

import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();

router.post(
    '/api/orders',
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.isValidObjectId(input))
            .withMessage('TicketId must be provided'),
    ],
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        // find the ticket the user is trying to order in the db

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new NotFoundError();
        }

        // make sure that the ticket is not already reserved

        const isReserved = await ticket.isReserved();
        // const isReserved = false;

        if (isReserved) {
            throw new BadRequestError('Ticket is already reserved');
        }

        // calculate an expiration time

        const expiration = new Date();

        expiration.setSeconds(
            expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
        );

        // build the order and persist it to the db

        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket,
        });

        await order.save();

        // publish an event saying that an order was created...

        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: { id: ticket.id, price: ticket.price },
        });

        res.status(201).send(order);
    }
);

export { router as newOrderRouter };
