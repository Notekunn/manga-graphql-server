import { gql } from 'apollo-server'

const typeDefs = gql`
  scalar Date
  enum UserRole {
    MEMBER
    MODERATOR
    ADMINISTRATOR
  }

  enum GroupRole {
    MEMBER
    MODERATOR
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
    groups: [GroupUser!]!
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
  type Group {
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
    groups: [Group!]!
    chapters(cursor: Int, limit: Int): [Chapter!]!
  }
  type Chapter {
    manga: Manga!
    chapterName: String!
    chapterFullName: String
    viewCount: Int!
    content: String
    lastUpdated: Date!
  }
  type Query {
    mangas: [Manga!]!
    manga(slug: String!): Manga
    artists: [Artist!]!
    users(cursor: Int, limit: Int): [User!]!
    categories: [Category!]!
    groups: [Group!]!
    chapters: [Chapter!]!
    chapter: Chapter!

    topManga(type: TopMangaType): [TopMangaResponse!]!
  }
  type Mutation {
    updateView(chapterId: Int!): Int!
  }
  type TopMangaResponse {
    manga: Manga!
    view: Int!
  }
  enum TopMangaType {
    DATE
    WEEK
    ALL
  }
  type GroupUser {
    group: Group!
    role: GroupRole!
    participantAt: Date!
  }
`
export default typeDefs
