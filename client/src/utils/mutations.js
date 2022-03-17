import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation loginUser($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`;

export const ADD_USER = gql`
mutation addUser($username: String!, $password: String!, $email: String!) {
  addUser(username: $username,  email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`;

export const SAVE_BOOK = gql`
    mutation saveBook($bookData: BookInput!) {
      saveBook(bookData: $bookData)
        {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                image
                link
                title
                description
            }
        }
    }
`;



export const DELETE_BOOK = gql`
    mutation deleteBook($bookId: ID!) {
        deleteBook(bookId:$bookId) {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                image
                link
                title
                description
            }
        }
}
`;