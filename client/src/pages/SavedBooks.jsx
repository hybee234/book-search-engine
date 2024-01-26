import { useState, useEffect } from 'react';
import {
    Container,
    Card,
    Button,
    Row,
    Col
} from 'react-bootstrap';

import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useMutation, useQuery } from '@apollo/client';
import { GET_ME } from './../utils/queries'
import { DELETE_BOOK } from './../utils/mutations'

const SavedBooks = () => {
    const [userData, setUserData] = useState({});

    // use this to determine if `useEffect()` hook needs to run again
    const userDataLength = Object.keys(userData).length;

    // Original code - RESTApi
    // useEffect(() => {
    //     const getUserData = async () => {
    //         try {
    //             // Check if a user is logged in - store token if so
    //             const token = Auth.loggedIn() ? Auth.getToken() : null;

    //             // If token is null then stop
    //             if (!token) {
    //                 return false;
    //             }

    //             // If token OK then call "getMe" passing through token details
    //             const response = await getMe(token);

    //             if (!response.ok) {
    //                 throw new Error('something went wrong!');
    //             }

    //             const user = await response.json();
    //             setUserData(user);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     };

    //     // Run get UserData if the userDataLength changes
    //     getUserData();
    //     }, [userDataLength]
    // );

    const {loading, data} = useQuery ( GET_ME );
    console.log('data', data)

    // New code Graph QL
    useEffect(() => {
        const getUserData = async () => {
            try {                
                
                // Check if a user is logged in - store token if so
                const token = Auth.loggedIn() ? Auth.getToken() : null;

                // If token is null then stop
                if (!token) {
                    return false;
                }

                console.log("token", token)
                // If token OK then call "getMe" passing through token details
                // const response = await getMe(token);

                

                // if (!response.ok) {
                //     throw new Error('something went wrong!');
                // }

                // const user = await response.json();
                // setUserData(user);
            } catch (err) {
                console.error(err);
            }
        };

        // Run get UserData if the userDataLength changes
        getUserData();
        }, [userDataLength]
    );








  // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            const response = await deleteBook(bookId, token);

            if (!response.ok) {
                throw new Error('something went wrong!');
            }

            const updatedUser = await response.json();
            setUserData(updatedUser);
            // upon success, remove book's id from localStorage
            removeBookId(bookId);
        } catch (err) {
            console.error(err);
        }
    };

  // if data isn't here yet, say so
    if (!userDataLength) {
        return <h2>LOADING...</h2>;
    }

    return (
        <>
            <div fluid className="text-light bg-dark p-5">
                <Container>
                    <h1>Viewing saved books!</h1>
                </Container>
            </div>
            <Container>
                <h2 className='pt-5'>
                    {
                        userData.savedBooks.length ?
                            `Viewing ${userData.savedBooks.length} saved
                                ${
                                    userData.savedBooks.length === 1 ?
                                        'book'
                                        :
                                        'books'
                                }:`
                            : 
                            'You have no saved books!'
                    }
                </h2>
                <Row>
                {userData.savedBooks.map((book) => {
                    return (
                        <Col md="4">
                            <Card key={book.bookId} border='dark'>
                                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                                <Card.Body>
                                    <Card.Title>{book.title}</Card.Title>
                                    <p className='small'>Authors: {book.authors}</p>
                                    <Card.Text>{book.description}</Card.Text>
                                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                                        Delete this Book!
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
                </Row>
            </Container>
        </>
    );
};

export default SavedBooks;
