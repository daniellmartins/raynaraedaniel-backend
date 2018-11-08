import { GraphQLServer } from "graphql-yoga";

import { prisma } from "./generated/prisma-client";
import { resolvers } from "./resolvers";
import { middlewares } from "./middlewares";
import { PORT, DEBUG, PLAYGROUND } from "./config";

const opts = {
  port: PORT,
  debug: DEBUG,
  playground: PLAYGROUND
};

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  middlewares,
  context: req => ({ ...req, db: prisma })
});

server.start(opts, ({ port }) =>
  console.log(`Server is running on http://localhost:${port}`)
);
