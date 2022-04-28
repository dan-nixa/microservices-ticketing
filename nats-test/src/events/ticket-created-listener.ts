import { Listener } from '@dbtix/microserv-common';

import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@dbtix/microserv-common';
import { Subjects } from '@dbtix/microserv-common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('event data!', data);

        msg.ack();
    }
}

// note no constructor, but when we initialize this class  we need to pass in the required properties of the abstact class's constructor

// goal here is to make sure that we can only refer to actual properties of data and that ts will check this for us.  also the enum ensures that we don't have to refer to plain strings...
