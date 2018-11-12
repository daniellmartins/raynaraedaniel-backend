import { join } from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";

import { prisma } from "../generated/prisma-client";

export const typeDefs = mergeTypes(
  fileLoader(join(__dirname, "./**/*.graphql"))
);

export const resolvers = mergeResolvers(
  fileLoader(join(__dirname, "./**/*.resolvers.*"))
);

export const context = req => ({ ...req, db: prisma });
