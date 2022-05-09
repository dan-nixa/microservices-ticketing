import {
    Publisher,
    OrderCreatedEvent,
    Subjects,
} from '@dbtix/microserv-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

// create a new instance of the publisher anytime we need to publish and event
