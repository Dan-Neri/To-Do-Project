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
    useToast
} from '@chakra-ui/react';
import { 
    Link, 
    Form, 
    useActionData, 
    useNavigate,
    Outlet,
    useLocation
} from 'react-router-dom';
import axios, { AxiosResponse, AxiosError } from 'axios';
import UserSignIn from '../user-sign-in';
import Dialog from '../components/dialog';

type StatusType = (
    'success' | 
    'error' | 
    'warning' | 
    'info' | 
    'loading' | 
    undefined
);

interface ActionData {
    params: {
        title: string;
        message: string;
        status: StatusType;
    } | undefined
};

export default function SignIn() {
    const [showPass, setShowPass] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

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
            console.log(error.message);
            toast({
                title: 'Error',
                description: error.message,
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
    
    return (
        <Flex 
            h='100vh' 
            bgSize='100% 100%' 
            justifyContent='flex-start' 
            alignItems='center'
            flexDirection='column'	
        >
            <Box>
                <Outlet />
            </Box>
            <Flex flex='1' justifyContent='center' alignItems='center'>
                <Dialog h='300px' w='500px' title='Sign In'>
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
                        </VStack>
                    </Form>
                </Dialog>
            </Flex>
        </Flex>
    );
}