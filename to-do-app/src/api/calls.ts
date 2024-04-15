/**
 * This file contains methods which can be reused to make calls to the
 * back-end API.
 */
import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from 'axios';
import Cookies from 'universal-cookie';
import { StatusType, UpdateUserDTO } from '../types/types';

/*Take a username and password. Send them to the API and return a jwt
if valid.*/
export async function UserSignIn (
    username: string, 
    password: string
): Promise<AxiosResponse> {
    const cookies = new Cookies(
        null, 
        { 
            path: '/',
            domain:'http://localhost:3000'
        }
    );
    //Create an object to store returned user data.
    const userData = {
        jwt: undefined,
        sub: undefined,
        username: undefined
    };
    //Send a Post request to the API to create a new user.
    const response = await axios.post('/auth/login', {
        username: username,
        password: password
    });
    //Pull the JWT from the response and store it in a userData object.
    userData.jwt = response.data.access_token;

    //Get the user information with the JWT.
    const getResponse = await axios.get('/auth/profile', {
        headers: { 'Authorization': `Bearer ${userData.jwt}` }
    });
    /*Pull the user id and username from the response and store it
    in the userData object.*/
    userData.sub = getResponse.data.sub;
    userData.username = getResponse.data.username;

    //Serialize the userData object and store it in a cookie
    const dataString = JSON.stringify(userData);
    cookies.set('userData', dataString, { 
            domain: 'localhost',
            sameSite: 'lax',
            maxAge: 3600
    });
    return getResponse;
}

/*Take a user id and return matching account information if the user is
authenticated.*/
export async function FetchAccount( 
    userID: string | undefined 
): Promise<AxiosResponse> {
    const cookies = new Cookies(null, { path: '/' });
    const userData = await cookies.get('userData');
    /*Check to make sure there is a JWT and that it matches the account
    you are trining to access.*/
    if (!userData || userID!==userData.sub) {
        cookies.remove('userData', { path: '/' });
        throw new Error('Authorization expired');
    }
    
    const { jwt, sub } = userData;
    if (jwt) {
        //Get the user information with the JWT.
        const response = await axios.get('/users/account', {
            headers: { 
                'Authorization': `Bearer ${jwt}`,
                'sub': `${sub}`
            }
        });
        if (!response) {
            throw new Error('No response from server');
        }
        return response;
    } else {
        cookies.remove('userData', { path: '/' });
        throw new Error('Invalid Authorization');
    }
}
        
/*Take a user id and a DTO containing any user account information.
Make an API call to allow an authenticated user to update the given
information in the database.*/
export async function UpdateAccount( 
    userID: string | undefined, 
    DTO: UpdateUserDTO 
): Promise<AxiosResponse> {
    const cookies = new Cookies(null, { path: '/' });
    const userData = await cookies.get('userData');
    /*Check to make sure there is a JWT and that it matches the account
    you are trining to access.*/
    if (!userData || userID!==userData.sub) {
        cookies.remove('userData', { path: '/' });
        throw new Error('Authorization expired');
    }
    
    const { jwt, sub } = userData;
    if (jwt) {
        //Make a Post request to the API to update the user information
        const response = await axios.post('/users/update', DTO, {
            headers: { 
                'Authorization': `Bearer ${userData.jwt}`,
                'sub': `${userData.sub}`
            }
        });
       if (!response) {
            throw new Error('No response from server');
        }
        return response;
    } else {
        cookies.remove('userData', { path: '/' });
        throw new Error('Invalid Authorization');
    }
}