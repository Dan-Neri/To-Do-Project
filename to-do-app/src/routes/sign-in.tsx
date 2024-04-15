/**
 * The SignIn route allows users to provide a username and password
 * which is validated via the UserSignIn call and stored in a cookie.
 * This route also allows a user to request a password reset email by
 * clicking on the forgot password link.
 */
import React, { FormEvent, useState, useEffect } from 'react';
import { 
    Box, 
    Flex, 
    Input, 
    Button,
    HStack,
    VStack, 
    FormControl,
    FormLabel,
    InputGroup,
    InputRightElement,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react';
import { 
    Link, 
    Form,
    useNavigate,
    Outlet,
    useLocation
} from 'react-router-dom';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { UserSignIn } from '../api/calls';
import Dialog from '../components/dialog';
import Page from '../components/page';
import { StatusType } from '../types/types';

export default function SignIn() {
    const [showPass, setShowPass] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    /*Send the username and password to the UserSignIn call. Redirect
    the user to the UserAccout route if successful or the SignIn route
    otherwise.*/
    async function HandleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        let response;
        try {
            response = await UserSignIn(
                formData.get('username') as string,
                formData.get('password') as string
            );
        }
        catch (error: any) {
            toast({
                title: 'Error',
                description: 'Invalid username or password',
                status: 'error' as StatusType,
                duration: 3000,
                isClosable: true
            });
            return navigate('/sign-in');
        }
        toast({
            title: `Welcome ${formData.get('username')}!`,
            description: 'Login Sucessful',
            status: 'success',
            duration: 3000,
            isClosable: true
        });
        return navigate(`/account/${response.data.sub}`);
    }
    
    /*Send the email address to the API so that a one-time use JWT and a
    password reset email can be generated and sent.*/
    async function handleFPSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const email = formData.get('email') as string;
        let response;
        toast({
            title: 'Check Your Inbox',
            description: `If a matching account is found an email will be sent 
                to ${formData.get('email')}`,
            status: 'info' as StatusType,
            duration: 5000,
            isClosable: true
        });
        try {
            /*Send a Post request to the API with the email address. If
            it matches a user, a reset email will be sent.*/
            const response = await axios.post('/auth/reset-email', {
                email: email
            });
            if (!response) {
                toast({
                    title: 'Error',
                    description: 'No response from the server.',
                    status: 'error' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
                return;
            }
            console.log(response.data);
        }
        catch(error: any) {
        }
    }
    
    return (
        <Page>
            <Dialog h='340px' w='500px' title='Sign In'>
                <Form onSubmit={HandleSubmit}>
                    <VStack w='320px' spacing='18px'>
                        <FormControl isRequired>
                            <FormLabel>
                                Username:
                            </FormLabel>
                            <Input 
                                bg='white' 
                                type='text' 
                                name='username' 
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>
                                Password:
                            </FormLabel>
                            <InputGroup>
                                <Input 
                                    type={showPass ? 'text' : 'password'} 
                                    bg='white' 
                                    name='password' 
                                />
                                <InputRightElement width='5rem'>
                                    <Button 
                                        height='1.75rem'
                                        colorScheme='teal' 
                                        onClick={
                                            () => setShowPass(!showPass)
                                        }
                                    >
                                        Show
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <HStack>
                            <Button type='submit' colorScheme='blue'>
                                Sign In
                            </Button>
                            <Link to='/sign-up'>
                                <Button>
                                    Create an Account
                                </Button>
                            </Link>
                        </HStack>
                        <Box onClick={onOpen} _hover={{
                                color: 'blue',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}>
                                Forgot Password
                        </Box>
                    </VStack>
                </Form>
            </Dialog>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <Dialog 
                        title='Reset Password' 
                        h='200px' 
                        exit={onClose}
                    >
                        <ModalBody>
                            <Form onSubmit={(event) => { 
                                handleFPSubmit(event); 
                                onClose();
                            }}>
                                <VStack>
                                    <FormControl isRequired>
                                        <FormLabel>
                                            Email Address: 
                                        </FormLabel>
                                        <Input 
                                            bg='white' 
                                            type='email' 
                                            name='email' 
                                        />
                                    </FormControl>
                                    <Button 
                                        type='submit' 
                                    >
                                        Reset password
                                    </Button>
                                </VStack>
                            </Form>
                        </ModalBody>
                    </Dialog>
                </ModalContent>
            </Modal>
        </Page>
    );
}