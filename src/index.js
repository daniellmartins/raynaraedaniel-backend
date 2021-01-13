import { GraphQLServer } from "graphql-yoga";
import "./database";

import { PORT, DEBUG, PLAYGROUND } from "./config";
import { middlewares } from "./middlewares";
import { typeDefs, resolvers, context } from "./api";

String.prototype.isEmpty = function () {
  return this.length === 0 || !this.trim();
};

const opts = {
  port: PORT || 3000,
  debug: DEBUG,
  endpoint: "/graphql",
  subscriptions: "/graphql",
  playground: PLAYGROUND,
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares,
  context,
});

server.start(opts, ({ port }) =>
  console.log(`Server is running on http://localhost:${port}`)
);
