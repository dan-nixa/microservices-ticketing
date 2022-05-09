import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
    errorHandler,
    NotFoundError,
    currentUser,
} from '@dbtix/microserv-common';
import { deleteOrderRouter } from './routes/delete-order';
import { indexOrderRouter } from './routes';
import { newOrderRouter } from './routes/new-order';
import { showOrderRouter } from './routes/show-order';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
);
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
