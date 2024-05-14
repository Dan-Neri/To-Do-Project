/**
 * The App file contains the main React App description. This app uses 
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
import ResetPassword from './routes/reset-password';
import UserAccount, { 
    loader as AccountLoader, 
    action as AccountAction 
} from './routes/user-account';
import Projects, {
    loader as ProjectsLoader, 
    action as ProjectsAction 
} from './routes/projects';
import ProjectInfo, { 
    loader as ProjectInfoLoader 
} from './routes/project-info';

//Set the baseURL which will prepend all other axios calls.
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
                    path='/account'
                    element={<UserAccount />}
                    loader={AccountLoader}
                    action={AccountAction}
                />
                <Route
                    path='/account/:userID/pw-reset/:token'
                    element={<ResetPassword />}
                />
                <Route
                    path='/projects'
                    element={<Projects />}
                    loader={ProjectsLoader}
                    action={ProjectsAction}
                />
                <Route
                    path='/projects/info'
                    element={<ProjectInfo />}
                    loader={ProjectInfoLoader}
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
