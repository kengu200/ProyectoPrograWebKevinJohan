import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import { buildSchema } from "type-graphql"

//import { PingResolver } from "./resolvers/ping.resolver";
//import { ProductResolver } from "./resolvers/product.resolver";
import { UserResolver } from './resolvers/user/user.resolver';
import { ServiceResolver } from './resolvers/service/service.resolver';
import { isAuthorizated } from "./middleware/is-authorizated";
export async function startServer() {
    const app = express();
    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, ServiceResolver],
            authChecker: isAuthorizated
        }),
        context: ({ req, res }) => ({ req, res }),

    });
    server.applyMiddleware({ app, path: '/graphql' });
    return app;
}


