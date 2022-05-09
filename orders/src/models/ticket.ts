import mongoose from 'mongoose';

import { Order, OrderStatus } from './order';

interface TicketAttrs {
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

// define build method
// statics is how we add methods to the *model* itself
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

// check if this ticket is already reserved...
// .method is how we add a property to the *document*
ticketSchema.methods.isReserved = async function () {
    // this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ],
        },
    });

    return !!existingOrder;
};
// interesting null check...!!
// if null, then first ! changes it to true. then this is converted to false with the second !. So if null --> false.

// if existing order is defined, then ! changes it to false. then ! changes it to true.

// create ticket model
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };

// order model is different here than in Tickets, and can't be moved to the common module because it is implementation specific --> it's specific to this db and would not necessarily be compatible with other services.

// also -- the orders service may grow to encapsulate the purcahse of things besides tickets...
