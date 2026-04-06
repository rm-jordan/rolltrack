import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { prisma } from "./prisma.js";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./typeDefs.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = Number(process.env.PORT) || 4000;

const { url } = await startStandaloneServer(server, {
  listen: { port },
  context: async () => ({ prisma }),
});

console.log(`RollTrack GraphQL API ready at ${url}`);
