// import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
    Container,
    Card,
    Button,
    Row,
    Col
} from 'react-bootstrap';

//import { getMe, deleteBook } from '../utils/API';
//import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { GET_ME } from './../utils/queries'
import { DELETE_BOOK } from './../utils/mutations'


const SavedBooks = () => {

    const { data, loading } = useQuery(GET_ME);
    // console.log(data)
    let userData = data?.me || {};


    const [deleteBook, { error }] = useMutation(DELETE_BOOK); // Delete

    const handleDeleteBook = async (bookId) =>  {
        console.log ("handleDeleteBook called")
        try {
            // Remove book from MongoDB
            const { data } = await deleteBook({
                variables: {
                    bookId: bookId
                }
            });

            console.log("data", data)

            //Remove bookID from local storage
            removeBookId(bookId);
            } catch (err) {
                console.log(JSON.stringify(err, null, 2)); //Much better error reporting for GraphQl issues
            }
        }

    if (loading) {
        return <h2>LOADING...</h2>;
    }   

    return (
        <>
            <div className="fluid text-light bg-dark p-5">
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
                        <Col key={book.bookId} md="4">
                            <Card border='dark'>
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
