import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, HStack, Hide } from '@chakra-ui/react';
import { Outlet, Link, useLoaderData, useNavigate } from "react-router-dom";
import axios, {AxiosResponse, AxiosError } from 'axios';
import Cookies from 'universal-cookie';
import img from '../images/plant1920.jpg';

interface LoaderData {
    username: string;
    loggedIn: boolean
}

export default function TopMenu() {
    const [username, setUsername] = useState('Guest');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const cookies = new Cookies(null, { path: '/' });
    
    useEffect(() => {
        //Check cookie for user data.
        const dataString = cookies.get('userData');
        if (dataString) {
            setUsername(dataString.username);
            setLoggedIn(true);
        }
    }, [cookies.get('userData')]);
    
    function SignOut() {
        cookies.remove('userData', { path: '/' });
        setUsername('Guest');
        setLoggedIn(false);
        navigate('/');
    }
    
    return (
        <Box h='100vh' w='99vw'>
            <Flex 
                justify='right'
                h='32px'
                bg='cyan.400'
                fontSize='16'
            >
                <HStack
                    justify='right'
                    w='20%'
                    padding='16px'
                    spacing='16px'
                >
                    <Box>
                        {loggedIn? username : 'Guest'}
                    </Box>
                    {loggedIn? ('') : (
                        <Link to='/sign-in'>
                            <Button
                                w='64px'
                                h='24px'
                                colorScheme='blue'
                                boxShadow='base'
                                fontSize='14'
                            >
                                Sign In
                            </Button>
                        </Link>
                    )}
                    {loggedIn? (
                        <Button
                            w='64px' 
                            h='24px'
                            colorScheme='blue'
                            boxShadow='base'
                            fontSize='14'
                            onClick={SignOut}
                        > 
                            Sign Out
                        </Button>
                    ) : (
                        <Link to='/sign-up'>
                            <Button
                                w='64px' 
                                h='24px'
                                colorScheme='blue'
                                boxShadow='base'
                                fontSize='14'
                            >
                                Sign Up
                            </Button>
                        </Link>
                    )}
                </HStack>
            </Flex>
            <Box bgImage={img} bgSize='100% 100%'>
                <Outlet />
            </Box>
        </Box>
    );
}