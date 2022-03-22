import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

let mongo: any;

declare global {
    var signin: () => Promise<string[]>;
}

// hook to run before tests suite start, initialize mongodb-memory-server
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf;lkjh';
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);
});

// run before each test
beforeEach(async () => {
    // before each test, reset data in mongodb

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    // could try:   await mongoose.disconnect();
});

global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({ email, password });

    const cookie = response.get('Set-Cookie');
    return cookie;
};
