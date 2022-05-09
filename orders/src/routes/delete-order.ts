import {
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
} from '@dbtix/microserv-common';
import express, { Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        // find order
        const order = await Order.findById(req.params.orderId).populate(
            'ticket'
        );

        if (!order) {
            throw new NotFoundError();
        }

        // user owns order
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        // change order to cancelled

        order.status = OrderStatus.Cancelled;
        await order.save();

        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id,
            },
        });

        res.status(204).send();
    }
);

export { router as deleteOrderRouter };
