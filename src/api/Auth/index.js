import authResolvers from "./auth.resolvers";
import { loadGQLFile } from "../../utils";

export default {
  resolvers: authResolvers,
  typeDefs: loadGQLFile("Auth/auth.graphql")
};
