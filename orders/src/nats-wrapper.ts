import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan;

    // getter to access the _client property -- note we don't call with ()! Instead you access (call) it as a property!
    get client() {
        if (!this._client) {
            throw new Error('Cannot access Nats client before connecting');
        }

        return this._client;
    }

    // promisfied connect method that we can await. will call this fron within index.ts

    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Connected to NATS Singleton');
                resolve();
            });
            this.client.on('error', (err) => {
                reject(err);
            });
        });
    }
}

export const natsWrapper = new NatsWrapper();
// singleton to share initialied instance to other files. instead of initialzing an instance of this class in various files, we initialize the instance of the class here and import the instance and make it accessable that way
