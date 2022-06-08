const { ApolloServer } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name}!`,
  },
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

exports.server = server;
