/**
 * The App file contains the main React App description. It uses 
 * ChakraUI to quickly inject predefined, customizable components and
 * Axios to make http requests to the back-end API.
 */
import React from 'react';
import { Box, Button, HStack, VStack} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { 
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
    Outlet
} from "react-router-dom";
import ErrorPage from './error-page';
import TopMenu from './routes/top-menu';
import Index from './routes/index';
import SignUp, { action as signUpAction } from './routes/sign-up';
import SignIn from './routes/sign-in';
import UserAccount, { 
    loader as userAccountLoader 
} from './routes/user-account';

axios.defaults.baseURL = 'http://localhost:3001/api';
    
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route 
            path='/'
            element={<TopMenu />}
            errorElement={<ErrorPage />}
        >
            <Route errorElement={<ErrorPage />}>
                <Route 
                    index 
                    element={<Index />}
                />
                <Route
                    path='/sign-up'
                    element={<SignUp />}
                    action={signUpAction}
                />
                <Route
                    path='/sign-in'
                    element={<SignIn />}
                />
                <Route
                    path='/account/:userID'
                    element={<UserAccount />}
                    loader={userAccountLoader}
                />
            </Route>
        </Route>
    )
);
        
function App() {
    return (
        <RouterProvider router={router} />
    );
};

export default App
