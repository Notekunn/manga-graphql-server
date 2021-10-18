import { gql } from 'apollo-server'

const typeDefs = gql`
  scalar Date
  enum UserRole {
    MEMBER
    TRANSLATOR
    MODERATOR
    ADMINISTRATOR
  }

  enum MangaStatus {
    CANCELLED
    DROPPED
    ONGOING
    COMPLETED
  }
  type User {
    id: ID!
    username: String!
    name: String
    email: String!
    password: String!
    avatarURL: String
    role: UserRole!
    translatorGroup: TranslatorGroup!
    managerGroup: TranslatorGroup
  }
  type Artist {
    id: ID!
    name: String!
    slug: String!
    about: String
    avatarURL: String
    mangas: [Manga!]!
  }
  type Category {
    id: ID!
    title: String!
    slug: String!
    description: String
    mangas: [Manga!]!
  }
  type TranslatorGroup {
    id: ID!
    name: String!
    description: String
    manager: User!
    members: [User!]!
    mangas: [Manga!]!
  }
  type Manga {
    id: ID!
    name: String!
    slug: String!
    otherName: String
    description: String
    status: MangaStatus!
    coverURL: String
    releaseYear: String
    lastUpdated: Date!
    viewCount: Int!
    artist: Artist
    categories: [Category!]!
    translatorGroups: [TranslatorGroup!]!
  }
  type Query {
    mangas: [Manga!]!
    artists: [Artist!]!
    users: [User!]!
    categories: [Category!]!
    groups: [TranslatorGroup!]!
  }
`
export default typeDefs
