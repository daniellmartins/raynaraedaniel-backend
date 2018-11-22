import { PubSub } from "graphql-yoga";
import { join } from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import { loaders } from "./dataloaders";

const pubSub = new PubSub();
const db = mergeResolvers(fileLoader(join(__dirname, "./**/*.model.*")));

export const typeDefs = mergeTypes(
  fileLoader(join(__dirname, "./**/*.graphql")),
  { all: true }
);

export const resolvers = mergeResolvers(
  fileLoader(join(__dirname, "./**/*.resolvers.*"))
);

export const context = req => ({ ...req, db, pubSub, loaders: loaders(db) });
