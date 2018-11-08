import { GraphQLServer } from "graphql-yoga";

import { PORT, DEBUG, PLAYGROUND } from "./config";
import { middlewares } from "./middlewares";
import { typeDefs, resolvers, context } from "./api";

const opts = {
  port: PORT,
  debug: DEBUG,
  playground: PLAYGROUND
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares,
  context
});

server.start(opts, ({ port }) =>
  console.log(`Server is running on http://localhost:${port}`)
);
