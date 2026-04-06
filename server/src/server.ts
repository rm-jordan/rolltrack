import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/typeDefs.js";
import { prisma } from "./lib/prisma.js";
import { resolvers } from "./resolvers/index.js";

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
