/**
 * The TopMenu route is the root level route for the project planning 
 * app. It displays an authenticated user's username in a bar at the top
 * of the screen and provides other navigation buttons. All other routes
 * in this app are children of the TopMenu route and are displayed in
 * outlet space below the bar at the top of the screen.
 */
import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import img from '../images/plant1920.jpg';

export default function TopMenu() {
    const [username, setUsername] = useState('Guest');
    const [userID, setUserID] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const cookies = new Cookies(null, { path: '/' });
    
    //
    useEffect(() => {
        //Check cookie for user data.
        const userData = cookies.get('userData');
        if (userData) {
            setUsername(userData.username);
            setUserID(userData.sub);
            setLoggedIn(true);
        }
    }, [cookies.get('userData')]);
    
    //Remove the userData cookie and sign the user out.
    function SignOut() {
        cookies.remove('userData', { path: '/' });
        setUsername('Guest');
        setLoggedIn(false);
        navigate('/');
    }
    
    return (
        <Box h='100vh' w='99vw'>
            <Flex 
                justifyContent='space-between'
                h='32px'
                bg='cyan.400'
                fontSize='16'
            >
                <Flex justify='flex-start' alignItems='center' ml='10px'>
                    <Link to='/'>
                        <Button h='28px' fontSize='16' colorScheme='blue'>
                            Home
                        </Button>
                    </Link>
                </Flex>
                <HStack
                    justify='flex-end'
                    w='20%'
                    padding='16px'
                    spacing='16px'
                >
                    <Box>
                        {loggedIn? username : 'Guest'}
                    </Box>
                    {loggedIn? (
                        <Link to={`/account/${userID}`}>
                            <Button
                                w='84px'
                                h='24px'
                                colorScheme='blue'
                                boxShadow='base'
                                fontSize='14'
                            >
                                My Account
                            </Button>
                        </Link>
                    ) : (
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