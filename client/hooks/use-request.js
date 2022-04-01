import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            setErrors(null);
            const response = await axios[method](url, body);
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oops...</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map((err) => {
                            return <li key={err.message}>{err.message}</li>;
                        })}
                    </ul>
                </div>
            );
        }
    };

    return { doRequest, errors };
};

// doRequest returns --> response.data if the request is successful. If the response is not successful, then setErrors is called in the catch block and this updates our 'errors' state with the JSX.

// where do we get the name useRequest in signup.js? --> it's the name we chose when we imported it.
