import {
    Publisher,
    Subjects,
    TicketCreatedEvent,
} from '@dbtix/microserv-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
