import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('retrieves a specific ticket for a given user', async () => {
    // build a ticket
    const ticket = await Ticket.build({
        title: 'concert',
        price: 20,
    });

    await ticket.save();

    const user = global.signin();

    // make a request to create an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make request to fetch the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another user's order", async () => {
    // build a ticket
    const ticket = await Ticket.build({
        title: 'concert',
        price: 20,
    });

    await ticket.save();

    const user = global.signin();

    // make a request to create an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make request to fetch the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .expect(401);
});
