const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  # type Auth {
  #   token: ID!
  #   profile: Profile
  # }

  type Query {
    singleUser(_id: ID!): User
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    get
  }

`;

module.exports = typeDefs;
