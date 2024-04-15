/**
 * The ResetPassword route is only shown to users who have a requested a
 * password reset email and requires a unique one-time use JWT which 
 * expires after 15 minutes and is created by the api after requesting a
 * password reset email from the sign-in route.
 */
 import React, { 
    FormEvent, 
    useState, 
    useEffect, 
    ChangeEvent 
} from 'react';
import { 
    Flex, 
    Input, 
    Button,
    VStack, 
    FormControl,
    FormLabel,
    InputGroup,
    InputRightElement,
    useToast,
    Tooltip
} from '@chakra-ui/react';
import { 
    Form, 
    useParams,
    useNavigate
} from 'react-router-dom';
import axios, { AxiosResponse, AxiosError } from 'axios';
import Dialog from '../components/dialog';

export default function ResetPassword() {
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passMatch, setPassMatch] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const { userID, token } = useParams();

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
        const newConfirmPass = event.target.value;
        setConfirmPass(newConfirmPass);
        setPassMatch(newConfirmPass === password);
    };

    /*Send a request to the API to validate the access token and update
    the user password.*/
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData;
        //Send a Post request to the API to update the password.
        try {
            const response = await axios.post('/auth/pw-reset', {
                userID: userID,
                token: token,
                password: password,
            })
        }
        catch (error: any) {
            const statusCode = error.response?.status;
            console.log(error);
            const msg = statusCode === 400? (
                'Password must not match previous.'
            ) : (
                'Link has expired. Please request a new one.'
            )
            toast({
                title: `Password Reset Failed`,
                description: msg,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            return
        }
        toast({
            title: `Password Reset Successful`,
            description: 'You may now login to your account',
            status: 'success',
            duration: 3000,
            isClosable: true
        });
        navigate('/sign-in');
    }
    
    return (
        <Flex 
            h='100vh' 
            bgSize='100% 100%' 
            justifyContent='flex-start' 
            alignItems='center'
            flexDirection='column'	
        >
            <Flex flex='1' justifyContent='center' alignItems='center'>
                <Dialog h='300px' w='480px' title='Reset Password'>
                    <Form onSubmit={handleSubmit}>
                        <VStack w='320px' spacing='18px'>
                            <FormControl isRequired>
                                <FormLabel>
                                    New Password:
                                </FormLabel>
                                <InputGroup>
                                    <Input 
                                        type={showPass ? 'text' : 'password'} 
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
                                                () => setShowPass(
                                                    !showPass
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
                            <Tooltip 
                                label="Passwords Don't Match"
                                closeOnClick={false}
                                isDisabled= {passMatch? true : false}
                            >
                                <Button 
                                    type={passMatch? 'submit' : 'button'} 
                                    colorScheme='blue'
                                >
                                    Submit
                                </Button>
                            </Tooltip>
                        </VStack>
                    </Form>
                </Dialog>
            </Flex>
        </Flex>
    );
}