import buildClient from '../api/buildClient';

const LandingPage = ({ currentUser }) => {
    return currentUser ? (
        <h1> You are signed in</h1>
    ) : (
        <h1>You are not signed in</h1>
    );
};

LandingPage.getInitialProps = async (context) => {
    const client = buildClient(context);

    const { data } = await client.get('/api/users/currentuser');
    return data;
};

export default LandingPage;

// getInitialProps is called once before page is rendered on server. return value is passed as props to our component.

// context --> this is the request that comes in

// buildClient --> we've preconfigured an axios client to make the request to the proper base url depending on what environment we are making the request from -- i.e., whether we are making the getInitialProps request from the browser or from the server

// if we are making a request from a component, then by definition we are making the request from the client. In that case, our domain is simple an empty string because the browser will append the correct domain.

// if we are in our getInitial props function, then we are making a request to one of our services from the server. To communicate between services on the server, we need to send our request to our nginx load balancer which will route them to the correct domain.

// getInitial props is executed on the server when:

// 1. Hard Refresh of page
// 2. clicking a link from a different domain
// 3. Typing url into address bar

// getInitialProps is executed on the client when:

// 1.  we navingate to a new page in our app from another page in our app.
