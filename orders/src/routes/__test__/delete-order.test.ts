import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('deletes a specific ticket for a given user', async () => {
    // build a ticket
    const ticket = await Ticket.build({
        title: 'concert',
        price: 20,
    });

    await ticket.save();

    const user = global.signin();

    // create an order with ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // delete the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);

    // check status of order
    const deletedOrder = await Order.findById(order.id);

    expect(deletedOrder!.id).toEqual(order.id);
    expect(deletedOrder!.status).toEqual('cancelled');
});

it("returns an error if one user tries to delete another user's order", async () => {
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
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .expect(401);
});

it.todo('emits an order cancelled event');
