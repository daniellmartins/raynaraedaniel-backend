import userResolvers from "./user.resolvers";
import { loadGQLFile } from "../../utils";

export default {
  resolvers: userResolvers,
  typeDefs: loadGQLFile("User/user.graphql")
};
