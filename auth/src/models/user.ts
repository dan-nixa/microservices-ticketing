import mongoose from 'mongoose';
import { Password } from '../services/password';

// properties required to CREATE a new user
interface UserAttrs {
    email: string;
    password: string;
}

// shows the properties that the user MOODEL will have in our code
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// mongoose adds properties to objects it creates (mongoose.Model).
// this interface indicates what properties that the UserDoc will
// have after it's created
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// middleware function implemented in mongoose
userSchema.pre('save', async function (done) {
    console.log('hashing 1?');
    // note we didn't use an arrow function because 'this' refers to the current document. if you use an arrow function, it will overwrite this.

    // makes sure that we only hash the password if the PASSWORD is modified. so we can update the user's email, without hashing the password again.
    // isModified will return true on the first save, so will work for initial commit
    if (this.isModified('password')) {
        console.log('hashing 2?');
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
        // need to call done() because of how mongoose handles async/await...
    }
    done();
});

// add a custom function build() to the UserSchema
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

// model type == model<T, U> and returns U. T and U are used inside of model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };

// note how we handle the password hashing here, insead of in the signup route file...

// mongoose steps for creating and using a model

// 1. create a schema, then add any methods to schema.static
// 2. create a model from the schema
// 3. user the model to save instances of the schema object.
