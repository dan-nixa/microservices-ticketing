import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: { email, password },
        onSuccess: () => Router.push('/'),
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        doRequest();
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                />
            </div>
            {errors || null}
            <button className="btn btn-primary"> Sign Up</button>
        </form>
    );
};

// routes are defined by file name auth/signup

// wire up state to input fields, and add in event handlers...

// where do we get the name useRequest?? because our use-request file exports a default function, when we import it, we can name it whatever we want... for instance 'import ttt from xyz'

// why does useRequest get called for every letter typed? And why doesn't it return an error then? Only returns an error once submitted.
// ----> reason: we call useState everytime there's a keystroke. useState causes our component to rerender, which causes the console.log to execute. It also calls useRequest to execute. No error is thrown because useRequest simply returns a function "doRequest" (and errors). you actually have to call doRequest to get the errors.

// useRequest returns a function that returns the result of the axios call if that was successful, or returns an jsx array of errors if there's an error.
