import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
    // to pass validation we need to provide a valid mongo id --> generate a random mongo id through mongoose
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    // to have a ticket that is reserved to test with, we need to save a ticket to the db, the ticket will be considered reserved if it is part of an order that is in one of the enumerated states

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    // note: userId doesn't have to be signed in because we are accessing the db directly, not going through our route which has the validation

    const order = Order.build({
        ticket,
        userId: 'test',
        status: OrderStatus.Created,
        expiresAt: new Date(), // order service does not look at expiration date, it will rely on the expiration service
    });

    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id,
        })
        .expect(400);
});

it('reserves a ticket', async () => {
    // make sure that there is a ticket that is free and not reserved.

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id,
        })
        .expect(201);
});

it('emits and order created event', async () => {
    // successfully create and order
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

//////////////// old

it('has a route handler listening to /api/orders for post requests', async () => {
    const response = await request(app).post('/api/orders').send({});
    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/orders').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

// TODO add create order test

// TODO -- it returns and error if the ticket is expired
