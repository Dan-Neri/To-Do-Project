import React, { FormEvent, useState } from 'react';
import { 
    Box, 
    Flex, 
    Input, 
    Button,
    HStack,
    VStack, 
    FormControl,
    FormLabel,
    InputRightElement,
    InputGroup,
    CloseButton
} from '@chakra-ui/react';
import { Link, Form, useActionData, redirect } from 'react-router-dom';
import axios, {AxiosResponse, AxiosError } from 'axios';
import UserSignIn from '../user-sign-in';
import Dialog from '../components/dialog';

export default function SignUp() {
    const errors = useActionData();
    const [show, setShow] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    
    function handleDialogClose() {
        setDialogOpen(false);
    }
    
    return (
        <Flex 
            h='100vh' 
            justifyContent='center' 
            alignItems='center'
        >
            <Dialog h='380px' title='Sign Up'>
                <Form method='post'>
                    <VStack spacing='18px'>
                        <HStack>
                            <FormControl isRequired>
                                <FormLabel>
                                    First Name:
                                </FormLabel>
                                <Input bg='white' name='fName' />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>
                                    Last Name:
                                </FormLabel>
                                <Input bg='white' name='lName' />
                            </FormControl>
                        </HStack>
                        <FormControl isRequired>
                            <FormLabel>
                                Username:
                            </FormLabel>
                            <Input bg='white' name='uName' />
                        </FormControl>
                        <FormControl isRequired>
                                <FormLabel>
                                    Password:
                                </FormLabel>
                            <InputGroup>
                                <Input 
                                    type={show ? 'text' : 'password'} 
                                    bg='white' 
                                    name='password' 
                                />
                                <InputRightElement width='5rem'>
                                    <Button 
                                        height='1.75rem'
                                        colorScheme='teal' 
                                        onClick={() => setShow(!show)}
                                    >
                                        Show
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <HStack>
                            <Button type='submit' colorScheme='blue'>
                                Sign Up
                            </Button>
                            <Link to='/'>
                                <Button>
                                    Cancel
                                </Button>
                            </Link>
                        </HStack>
                    </VStack>
                </Form>
            </Dialog>
        </Flex>
    );
}

export async function action({ request }: { request: Request }) {
    let response = {body:'No response', data: []};
    const formData = await request.formData();
    //Send a Post request to the API to create a new user.
    try {
        response = await axios.post('/users/create', {
            firstName: formData.get('fName'),
            lastName: formData.get('lName'),
            username: formData.get('uName'),
            password: formData.get('password')
        })
    }
    catch (error: any) {
        console.log('Error creating user');
        throw new Error(error.message);
    }
    console.log(response.data);
    const signInResponse = await UserSignIn(
        formData.get('uName') as string, 
        formData.get('password') as string
    );
    return redirect('/account/userID');
}