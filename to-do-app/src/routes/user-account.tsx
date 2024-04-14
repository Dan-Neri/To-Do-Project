/**
 * The UserAccount route allows an authenticated user to view and update
 * their account information.
 */
 import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { 
    Box, 
    Button, 
    Flex, 
    HStack, 
    useToast,
    Input,
    FormControl,
    FormLabel,
    Tooltip
} from '@chakra-ui/react';
import { useParams, useNavigate, Form } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from 'axios';
import Page from '../components/page';
import { FetchAccount, UpdateAccount } from '../api/calls'
import { StatusType, UpdateUserDTO } from '../types/types';

export default function UserAccount() {
    const { userID } = useParams();
    const [ userInfo, setUserInfo ] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: ''
    });
    const [ password, setPassword ] = useState('');
    const [ confirmPass, setConfirmPass ] = useState('');
    const [ passMatch, setPassMatch ] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();
    
    /*Check to make sure the user is logged in and pull their account
    information from the API.*/
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await FetchAccount(userID);
                if (response) {
                    const { id, ...rest } = response.data;
                    setUserInfo(rest);
                }
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
                return navigate('/sign-in');
            }
        }
        fetchData();
    }, []);
    
    //Update the password and passMatch states.
    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        setPassMatch(newPassword === confirmPass);
    }
    
    //Update the confirmPass and passMatch states.
    const handleConfirmPass = (event: ChangeEvent<HTMLInputElement>) => {
        const newConfirmPass = event.target.value;
        setConfirmPass(newConfirmPass);
        setPassMatch(newConfirmPass === password);
    }
    
    //Clear the password and confirm password fields.
    const resetPassFields = () => {
        setPassword(''); 
        setConfirmPass('');
        setPassMatch(true);
    }
    
    //Send the form data to the api to update the user's account.
    const handleSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        let response;
        let DTO: UpdateUserDTO = {};
        formData.forEach((value, key) => {
            if ((typeof value === 'string') && (value.trim() !== '')) {
                DTO[key] = value;
            }
        });
        
        if (Object.values(DTO).some(value => value)) {
            try {
                const response = await UpdateAccount(userID, DTO);
                if (response) {
                    const { id, ...rest } = response.data;
                    setUserInfo(rest);
                    toast({
                        title: 'Success',
                        description: 'Your information has been updated.',
                        status: 'success' as StatusType,
                        duration: 4000,
                        isClosable: true
                    });
                    
                }
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
                    return navigate('/sign-in');
                }
            }
        }
    }

    return (
        <Page title='Account Information' justify='center'>
            <Flex 
                w='60%' 
                h='95%' 
                border='2px' 
                borderColor='black' 
                justify='center'
                alignItems='center'
            >
                <Form 
                    onSubmit={handleSave} 
                    style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <FormControl w='120%'>
                        <HStack>
                            <FormLabel w='50%' textAlign='right'>
                                    First Name:
                            </FormLabel>
                            <Input 
                                bg='white' 
                                name='firstName'
                                placeholder={userInfo.firstName}
                                _placeholder={{ opacity: 1, color: 'black' }}
                            />
                        </HStack>
                    </FormControl>
                    <FormControl w='120%'>
                        <HStack>
                            <FormLabel w='50%' textAlign='right'>
                                    Last Name:
                            </FormLabel>
                            <Input 
                                bg='white' 
                                name='lastName'
                                placeholder={userInfo.lastName}
                                _placeholder={{ opacity: 1, color: 'black' }}
                            />
                        </HStack>
                    </FormControl>
                    <FormControl w='120%'>
                        <HStack>
                            <FormLabel w='50%' textAlign='right'>
                                    Username:
                            </FormLabel>
                            <Input 
                                bg='white' 
                                name='username'
                                placeholder={userInfo.username}
                                _placeholder={{ opacity: 1, color: 'black' }}
                            />
                        </HStack>
                    </FormControl>
                    <FormControl w='120%'>
                        <HStack>
                            <FormLabel w='50%' textAlign='right'>
                                    Email Address:
                            </FormLabel>
                            <Input 
                                bg='white'
                                name='email'
                                type='email'
                                placeholder={userInfo.email}
                                _placeholder={{ opacity: 1, color: 'black' }}
                            />
                        </HStack>
                    </FormControl>
                    <FormControl w='120%'>
                        <HStack >
                            <FormLabel w='50%' textAlign='right'>
                                    Password:
                            </FormLabel>
                            <Input 
                                bg='white'
                                name='password'
                                type='password'
                                value={password}
                                onChange={handlePassword}
                            />
                        </HStack>
                    </FormControl>
                    <FormControl w='120%'>
                        <HStack>
                            <FormLabel w='50%' textAlign='right'>
                                    Confirm Password:
                            </FormLabel>
                            <Input 
                                bg='white'
                                name='confirmPass'
                                type='password'
                                value={confirmPass}
                                onChange={handleConfirmPass}
                            />
                        </HStack>
                    </FormControl>
                        <HStack mt='10px'>
                            <FormControl>
                                <Tooltip 
                                    label="Passwords Don't Match"
                                    closeOnClick={false}
                                    isDisabled= {passMatch? true : false}
                                >
                                    <Button 
                                        colorScheme='blue' 
                                        type={passMatch? 'submit' : 'button'}
                                    >
                                        Save
                                    </Button>
                                </Tooltip>
                            </FormControl>
                            <FormControl>
                                <Button 
                                    colorScheme='teal' 
                                    type='reset'
                                    onClick={resetPassFields}
                                >
                                    Cancel
                                </Button>
                            </FormControl>
                        </HStack>
                </Form>
            </Flex>
        </Page>
    );
}