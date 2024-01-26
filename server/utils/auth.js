const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

module.exports = {
    //Custom error message when authentication fails (resolvers)
    AuthenticationError: new GraphQLError('Could not authenticate user.', {
        extensions: {
            code: 'UNAUTHENTICATED',
        },
    }),
    //Server validation of token with requests from client
    authMiddleware: function ({req}) {
        // allows token to be received by server via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // if header, then split out "Bearer"
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        if (!token) {
            return req
        }

        // verify token and obtain user data
        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');     
        }
        // return the request object so it can be passed to the resolver as `context`
        return req;
    },

    //Create JWT - called by "createUser" and "login" resolvers
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};
