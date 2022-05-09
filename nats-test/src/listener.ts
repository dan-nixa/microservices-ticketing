import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

// gave service a random id so that we can scale up our services and ids don't clash
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222',
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('Nats connection closed (listener)');
        process.exit();
    });

    new TicketCreatedListener(stan).listen();
});

// intercepts interrupt or terminate commands and then calls stan.close()to gracefully close our client. --> this will reach out to service and tell it not to send additional requests to this client
process.on('SIGINT', () => {
    stan.close();
});
process.on('SIGTERM', () => {
    stan.close();
});
