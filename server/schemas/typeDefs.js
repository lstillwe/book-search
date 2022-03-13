// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
type Book {
    _id: ID
    bookId: String
    authors: [String]
    description: String
    image: String
    link: String
    title: String
}
type User {
    username: String
    email: String
    password: String
    savedBooks: [Book]
}
type Query {
    user: User
}

type Auth {
    token: ID!
    user: User
}
`;

// export the typeDefs
module.exports = typeDefs;