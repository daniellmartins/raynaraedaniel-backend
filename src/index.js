const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");
const { resolvers } = require("./resolvers");

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: prisma
  })
});

server.start(({ port }) =>
  console.log(`Server is running on http://localhost:${port}`)
);
