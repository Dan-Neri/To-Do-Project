/**
 * The App file contains the main React App description. It uses 
 * ChakraUI to quickly inject predefined, customizable components and
 * Axios to make http requests to the back-end API.
 */
import React from 'react';
import './App.css';
import { Box, Button, HStack, VStack} from '@chakra-ui/react'
import { useState } from 'react' 
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3001/api';
    
function App() {
    //Holds the value of the button as state.
    const [value, setValue] = useState('Click Me');
    //Holds the contents of the React table as state.
    const [users, setUsers] = useState([
        {id: '', firstName: '', lastName: '', username: '', isActive: ''}
    ]);
    async function clickHandle() {
        //Send a Post request to the API to create a new user.
    await axios.post('/users/create', {
        firstName: 'Dan',
        lastName: 'Neri',
        username: 'dneri'
    })
        .then(function (response) {
            setValue('Data sent to database')
        })
        .catch(function (error) {
            console.log(error);
        });
        //Send a Get request to the API which returns all users in the database
        await axios.get('/users/')
        .then(function (response) {
            console.log(response.data);
            setUsers(response.data);
        })
        .catch(function (error) {
            console.log(error);
            setUsers(error.data);
        });
    };
    
    return (
        <>
            <Button onClick={clickHandle}>
                {value}
            </Button>
            <HStack 
                color='black' 
                bg='lightblue' 
                spacing='12px' 
                w='100%' 
                h='80%'
            >
                <VStack spacing='12px' h='100%' w='20%'>
                    <Box>
                        ID
                    </Box>
                    {users.map(user => (
                        <Box key={user.id}>
                            {user.id}
                        </Box>
                    ))}
                </VStack>
                <VStack spacing='12px' h='100%' w='20%'>
                    <Box>
                        First Name
                    </Box>
                    {users.map(user => (
                        <Box key={user.id}>
                            {user.firstName}
                        </Box>
                    ))}
                </VStack>
                <VStack spacing='12px' h='100%' w='20%'>
                    <Box>
                        Last Name
                    </Box>
                    {users.map(user => (
                        <Box key={user.id}>
                            {user.lastName}
                        </Box>
                    ))}
                </VStack>
                <VStack spacing='12px' h='100%' w='20%'>
                    <Box>
                        Username
                    </Box>
                    {users.map(user => (
                        <Box key={user.id}>
                            {user.username}
                        </Box>
                    ))}
                </VStack>
                <VStack spacing='12px' h='100%' w='20%'>
                    <Box>
                        Active
                    </Box>
                    {users.map(user => (
                        <Box key={user.id}>
                            {user.isActive? 'True' : 'False'}
                        </Box>
                    ))}
                </VStack>
            </HStack>
        </>
    );
};

export default App;
