import { Publisher } from '@dbtix/microserv-common';
import { Subjects } from '@dbtix/microserv-common';
import { TicketCreatedEvent } from '@dbtix/microserv-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
