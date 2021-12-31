import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer, gql } from 'apollo-server-core';
import { fastify, FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

import fastifyStatic from 'fastify-static';
import path from 'path';
import pino from 'pino';
import mongo from 'fastify-mongodb';

const PORT = process.env.PORT || 7000;
const HOST = '0.0.0.0';
const MONGO_URI = process.env.MONGO_URI || `mongodb://localhost:27017/daily`;

function fastifyAppClosePlugin(app: FastifyInstance): any {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        },
      };
    },
  };
}

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => [
      {
        title: 'The Awakening',
        author: 'Kate Chopin',
      },
      {
        title: 'City of Glass',
        author: 'Paul Auster',
      },
    ],
  },
};

// Create an http server. We pass the relevant typings for our http version used.
// By passing types we get correctly typed access to the underlying http objects in routes.
// If using http2 we'd pass <http2.Http2Server, http2.Http2ServerRequest, http2.Http2ServerResponse>
const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({ logger: pino({ level: 'info' }) });

app.register(mongo, {
  forceClose: true,
  url: MONGO_URI,
});

async function startApolloServer(typeDefs: any, resolvers: any) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [fastifyAppClosePlugin(app), ApolloServerPluginDrainHttpServer({ httpServer: app.server })],
  });

  await server.start();
  app.register(server.createHandler());

  app.register(fastifyStatic, {
    root: path.join(__dirname, './static'),
  });

  app.setNotFoundHandler((_, res) => {
    res.sendFile('index.html');
  });

  await app.listen(PORT, HOST);
  console.log(`🚀 Server ready at http://${HOST}:${PORT}${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
