import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');

declare global {
    var signin: () => string[];
}

beforeAll(async () => {
    try {
        process.env.JWT_KEY = 'asdflkjh';
        const mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();
        await mongoose.connect(uri);
        console.log('connected to MongoMemoryServer');
    } catch (error) {
        console.log('Error connecting to MongoMemoryServer');
    }
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

global.signin = () => {
    // Build a JWT payload.  { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toString(),
        email: 'test@test.com',
    };

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`express:sess=${base64}`];
};
