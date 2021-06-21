import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import { buildSchema } from "type-graphql"

import { UserResolver } from './resolvers/user/user.resolver';
import { ServiceResolver } from './resolvers/service/service.resolver';
import { ReviewResolver } from './resolvers/review/review.resolver';
import { isAuthorizated } from "./middleware/is-authorizated";
export async function startServer() {
    const app = express();
    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, ServiceResolver, ReviewResolver],
            authChecker: isAuthorizated
        }),
        context: ({ req, res }) => ({ req, res }),

    });
    app.use('/graphql', express.json({limit: '50mb'}));
    server.applyMiddleware({ app, path: '/graphql' });
    return app;
}


