import { gql } from '@apollo/client';

export const QUERY_SINGLE_USER = gql`
    query SingleUser($userId: ID, $username: String) {
        singleUser(userId: $userId, username: $username) {
            username
            _id
            email
            bookCount
            savedBooks {
                authors
                bookId
                description
                image
                link
                title
            }        
        }
    }
`;

export const GET_ME = gql`
    query GetMe {
        me {
            username
            _id
            email
            bookCount
            savedBooks {
                authors
                bookId
                description
                image
                link
                title
            } 
        }
    }
`;
