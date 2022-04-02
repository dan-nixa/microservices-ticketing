import express from 'express';
import { currentUser } from '@dbtix/microserv-common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

// --> if currentUser is not defined, then we want to send back null, not undefined.
