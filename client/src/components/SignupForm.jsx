import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { CREATE_USER } from './../utils/mutations'

// import { createUser } from '../utils/API';

import Auth from '../utils/auth';

const SignupForm = () => {
    // set initial form state
    const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
    // set state for form validation
    const [validated] = useState(false);
    // set state for alert
    const [showAlert, setShowAlert] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };


    //Original Create User RestFul API approach
    // const handleFormSubmit = async (event) => {
    //     event.preventDefault();

    //     // check if form has everything (as per react-bootstrap docs)
    //     const form = event.currentTarget;
    //     if (form.checkValidity() === false) {
    //         event.preventDefault();
    //         event.stopPropagation();
    //     }

    //     try {
    //         const response = await createUser(userFormData);

    //         if (!response.ok) {
    //             throw new Error('something went wrong!');
    //         }

    //         const { token, user } = await response.json();
    //         console.log(user);
    //         Auth.login(token);
    //     } catch (err) {
    //         console.error(err);
    //         setShowAlert(true);
    //     }

    //     setUserFormData({
    //         username: '',
    //         email: '',
    //         password: '',
    //     });
    // };


    // GraphQL useMutation method
    // Bring GraphQL query in with useMutation Hook
    const [CreateUser, { error }] = useMutation(CREATE_USER);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // check if form has everything (as per react-bootstrap docs)
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Graph QL useMutation method
        try {

            const { data } = await CreateUser({
                variables: {
                    username: userFormData.username,
                    email:userFormData.email,
                    password: userFormData.password,
                }
            })

            // console.log("data", data)
            // console.log("data.createUser.token", data.createUser.token)
            // console.log("data.createUser.user", data.createUser.user)

            // Store token in local storage - id_token (Auth.login already redirects use to home page)
            Auth.login(data.createUser.token);
        } catch (err) {
            console.error(err);
            setShowAlert(true);
        }

        setUserFormData({
            username: '',
            email: '',
            password: '',
        });
    };


    return (
        <>
            {/* This is needed for the validation functionality above */}
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                {/* show alert if server response is bad */}
                <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
                    Something went wrong with your signup!
                </Alert>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='username'>Username</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Your username'
                        name='username'
                        onChange={handleInputChange}
                        value={userFormData.username}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='email'>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Your email address'
                        name='email'
                        onChange={handleInputChange}
                        value={userFormData.email}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='password'>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Your password'
                        name='password'
                        onChange={handleInputChange}
                        value={userFormData.password}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
                </Form.Group>
                <Button
                    disabled={!(userFormData.username && userFormData.email && userFormData.password)}
                    type='submit'
                    variant='success'>
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default SignupForm;
