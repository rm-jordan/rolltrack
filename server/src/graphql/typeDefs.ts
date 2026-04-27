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
    level: String
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

  input CreateTechniqueInput {
    name: String!
    position: String!
    category: String!
    beltGuideline: String!
    level: String
    tags: [String!]
    notes: String
  }

  input UpdateTechniqueInput {
    name: String
    position: String
    category: String
    beltGuideline: String
    level: String
    tags: [String!]
    notes: String
  }

  type Mutation {
    createSessionLog(input: CreateSessionLogInput!): SessionLog!
    createTechnique(input: CreateTechniqueInput!): Technique!
    updateTechnique(id: ID!, input: UpdateTechniqueInput!): Technique!
    deleteTechnique(id: ID!): Boolean!
  }
`;
