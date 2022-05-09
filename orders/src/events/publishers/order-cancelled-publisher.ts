import {
    Publisher,
    OrderCancelledEvent,
    Subjects,
} from '@dbtix/microserv-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

// create a new instance of the publisher anytime we need to publish and event
