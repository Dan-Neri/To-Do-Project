import axios, { AxiosResponse, AxiosError } from 'axios';
import Cookies from 'universal-cookie';

export default async function UserSignIn (
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
    let getResponse;
    //Create an object to store returned user data.
    let userData = {
        jwt: undefined,
        sub: undefined,
        username: undefined
    };
    try {
        //Send a Post request to the API to create a new user.
        console.log(username);
        console.log(password);
        const response = await axios.post('/auth/login', {
            username: username,
            password: password
        });
        //Pull the JWT from the response and store it in a userData object.
        userData.jwt = response.data.access_token;
    }
    catch(error: any) {
        console.log('sign-in post error');
        console.log(error.response.data.message);
        throw new Error(error.response.data.message);
    };
    try {
        //Get the user information with the JWT.
        getResponse = await axios.get('/auth/profile', {
            headers: { 'Authorization': `Bearer ${userData.jwt}` }
        });
        console.log(getResponse);
        /*Pull the user id and username from the response and store it
        in the userData object.*/
        userData.sub = getResponse.data.sub;
        userData.username = getResponse.data.username;
    }
    catch (error: any) {
        console.log('sign-in get error');
        console.log(error.response.data.message);
        throw new Error(error.response.data.message);
    }
    //Serialize the userData object and store it in a cookie
    const dataString = JSON.stringify(userData);
    cookies.set('userData', dataString, { 
            domain: 'localhost',
            sameSite: 'lax',
            maxAge: 360
    });
    return getResponse;
}