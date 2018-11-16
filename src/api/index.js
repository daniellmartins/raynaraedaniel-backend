import { join } from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";

import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/graphql-schema/prisma.graphql",
  endpoint: "http://localhost:4466/raynaraedaniel/dev",
  debug: true
});

export const typeDefs = mergeTypes(
  fileLoader(join(__dirname, "./**/*.graphql")),
  { all: true }
);

export const resolvers = mergeResolvers(
  fileLoader(join(__dirname, "./**/*.resolvers.*"))
);

export const context = req => ({ ...req, db: prisma });
