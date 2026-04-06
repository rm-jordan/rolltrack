export const typeDefs = `#graphql
  type RollNote {
    partner: String!
    rounds: Int!
    notes: String!
  }

  type Technique {
    id: ID!
    name: String!
    position: String!
    category: String!
    beltGuideline: String!
    tags: [String!]!
    notes: String
    timesPracticed: Int!
    lastPracticed: String
  }

  type SessionLog {
    id: ID!
    date: String!
    giType: String!
    sessionType: String!
    techniquesPracticed: [String!]!
    notes: String!
    rollNotes: [RollNote!]
  }

  type Query {
    health: String!
    techniques: [Technique!]!
    sessionLogs: [SessionLog!]!
    technique(id: ID!): Technique
  }

  input RollNoteInput {
    partner: String!
    rounds: Int!
    notes: String!
  }

  input CreateSessionLogInput {
    date: String!
    giType: String!
    sessionType: String!
    techniquesPracticed: [String!]!
    notes: String!
    rollNotes: [RollNoteInput!]
  }

  type Mutation {
    createSessionLog(input: CreateSessionLogInput!): SessionLog!
  }
`;
