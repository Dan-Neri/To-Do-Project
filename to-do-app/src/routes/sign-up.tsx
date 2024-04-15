/**
 * The SignUp route allows new users to create an account by sending a
 * Post request to the API.
 */
import React, { ChangeEvent, useState, FormEvent } from 'react';
import { 
    Box, 
    Input, 
    Button,
    HStack,
    VStack, 
    FormControl,
    FormLabel,
    InputRightElement,
    InputGroup,
    Tooltip,
    useToast
} from '@chakra-ui/react';
import { Link, Form, useNavigate } from 'react-router-dom';
import axios, {AxiosResponse, AxiosError } from 'axios';
import { UserSignIn } from '../api/calls';
import Dialog from '../components/dialog';
import Page from '../components/page';
import { StatusType } from '../types/types';

export default function SignUp() {
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passMatch, setPassMatch] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    
    //Update the password and passMatch states.
    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        setPassMatch(newPassword === confirmPass);
    };
    
    //Update the confirmPass and passMatch states.
    const handleConfirmPass = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const newConfirmPass = event.target.value
        setConfirmPass(newConfirmPass);
        setPassMatch(newConfirmPass === password);
    };
    
    /*Send the form data to the APi to create a new user, log in as that
    new user, and save the resulting JWT in a cookie*/
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const firstName = formData.get('fName') as string;
        const lastName = formData.get('lName') as string;
        const email = formData.get('email') as string;
        const username = formData.get('uName') as string;
        //Send a Post request to the API to create a new user.
        try {
            const response = await axios.post('/users/create', {
                firstName: (
                    firstName[0].toUpperCase() + 
                    firstName.substring(1).toLowerCase()
                ),
                lastName: (
                    lastName[0].toUpperCase() + 
                    lastName.substring(1).toLowerCase()
                ),
                email: email.toLowerCase(),
                username: username.toLowerCase(),
                password: password
            })
        }
        catch (error: any) {
            if(error.response) {
                toast({
                    title: 'Error',
                    description: error.response.data.message,
                    status: 'error' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
            } else {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
            }
            return;
        }
        try {
            const signInResponse = await UserSignIn(
                formData.get('uName') as string, 
                formData.get('password') as string
            );
            if (!signInResponse) {
                toast({
                    title: 'Error',
                    description: 'No response from the server.',
                    status: 'error' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
                return;
            }
            return navigate(`/account/${signInResponse.data.sub}`);
        } catch (error: any) {
            if(error.response) {
                toast({
                    title: 'Error',
                    description: error.response.data.message,
                    status: 'error' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
            } else {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
            }
            return;
        }
    }
    
    return (
        <Page>
            <Dialog h='620px' title='Sign Up'>
                <Form onSubmit={handleSubmit}>
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
                                Email Address:
                            </FormLabel>
                            <Input type='email' bg='white' name='email' />
                        </FormControl>
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
                                    type={showPassword ? 'text' : 'password'} 
                                    bg='white' 
                                    name='password'
                                    value={password}
                                    onChange={handlePassword}
                                />
                                <InputRightElement width='5rem'>
                                    <Button 
                                        height='1.75rem'
                                        colorScheme='teal' 
                                        onClick={
                                            () => setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        Show
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>
                                Confirm Password:
                            </FormLabel>
                            <InputGroup>
                                <Input 
                                    type={
                                        showConfirmPass ? (
                                            'text'
                                        ) : ( 
                                            'password'
                                        )
                                    } 
                                    bg='white' 
                                    name='confirmPassword'
                                    value={confirmPass}
                                    onChange={handleConfirmPass}
                                />
                                <InputRightElement width='5rem'>
                                    <Button 
                                        height='1.75rem'
                                        colorScheme='teal' 
                                        onClick={
                                            () => setShowConfirmPass(
                                                !showConfirmPass
                                            )
                                        }
                                    >
                                        Show
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <HStack>
                            <Tooltip 
                                label="Passwords Don't Match"
                                closeOnClick={false}
                                isDisabled= {passMatch? true : false}
                            >
                                <Button 
                                    type={passMatch? 'submit' : 'button'} 
                                    colorScheme='blue'
                                >
                                    Sign Up
                                </Button>
                            </Tooltip>
                            <Link to='/'>
                                <Button>
                                    Cancel
                                </Button>
                            </Link>
                        </HStack>
                    </VStack>
                </Form>
            </Dialog>
        </Page>
    );
}

export async function action({ request }: { request: Request }) {

}