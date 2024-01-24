// Define the necessary `Query` and `Mutation` types

const typeDefs = `
    type Book {
        _id: ID
        authors: [String]
        description: String
        bookId: String
        image: String        
        link: String
        title: String
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Query {
        users: [User]
        singleUser(username: String, userId: ID): User
    }

    input saveBookInput {
        bookId: ID
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }


    type Mutation {
        createUser(username: String! email: String!): User
  #      login(username: String! email: String!): User
  #      saveBook(userId: ID! input:saveBookInput): User
  #      deleteBook (userId: ID! bookId: ID! ): User
    }


`;

module.exports = typeDefs;