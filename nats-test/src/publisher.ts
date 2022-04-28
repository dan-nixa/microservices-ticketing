import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222',
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const publisher = await new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: '123',
            title: 'test title',
            price: 34,
            userId: '123',
        });
        console.log(`Event Pubished`);
    } catch (err) {
        console.error(err);
    }

    // stan.publish('ticket:created', data, () => {
    //     console.log('Event Published');
    // });
});
