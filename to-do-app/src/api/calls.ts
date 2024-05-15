/**
 * This file contains methods which can be reused to make calls to the
 * back-end API.
 */
import axios, { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';

/*Take a username and password. Send them to the API and return a JWT
if valid.*/
export async function UserSignIn (
    username: string, 
    password: string,
    setLoggedIn: (loggedIn: boolean) => void,
    setUsername: (username: string) => void
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
    const getResponse = await getUser(userData.jwt);
    
    /*Pull the user id and username from the response and store it
    in the userData object.*/
    userData.sub = getResponse.data.sub;
    userData.username = getResponse.data.username;
    //Update the logged in state and username.
    setUsername(getResponse.data.username);
    setLoggedIn(true);

    //Serialize the userData object and store it in a cookie
    const dataString = JSON.stringify(userData);
    cookies.set('userData', dataString, { 
            domain: 'localhost',
            sameSite: 'lax',
            maxAge: 3600
    });
    
    return getResponse;
}

//Get the username and ID with a valid jwt.
export async function getUser(jwt: string | undefined) {
    const response = await axios.get('auth/profile', {
        headers: { 'Authorization': `Bearer ${jwt}` }
    });
    
    return response;
}

/*This method is used to pull data from the back-end API. Take an API 
route, get the access token from cookies, and use Axios to make an HTTP
GET request to the route with the token in the header. Return the 
response.*/
export async function FetchData( 
    route: string
): Promise<AxiosResponse> {
    const cookies = new Cookies(null, { path: '/' });
    const userData = await cookies.get('userData');
    //Check to make sure our cookie exists and isn't expired.
    if (!userData) {
        cookies.remove('userData', { path: '/' });
        throw new Error('Authorization expired');
    }
    
    const { jwt } = userData;
    //Check to make sure there is a JWT in the cookie.
    if (jwt) {
        //Make the GET request with the JWT in the header.
        const response = await axios.get(route, {
            headers: { 
                'Authorization': `Bearer ${jwt}`
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
        
/*This method is used to send new or updated data to the back-end API.
Take an API route and a an optional DTO containing information to be 
created/updated. Get the user's access token from cookies. Use Axios to
Make an HTTP POST request to the route with the access token in the
header and the DTO in the body. Return the response.*/
export async function UpdateData( 
    route: string,
    DTO?: any 
): Promise<AxiosResponse> {
    const cookies = new Cookies(null, { path: '/' });
    const userData = await cookies.get('userData');
    //Check to make sure our cookie exists and isn't expired.
    if (!userData) {
        cookies.remove('userData', { path: '/' });
        throw new Error('Authorization expired');
    }
    
    const { jwt } = userData;
    //Check to make sure there is a JWT in the cookie
    if (jwt) {
        /*Make a Post request to the API with the JWT in the header and
        the DTO in the body if present.*/
        const response = await axios.post(route, DTO && DTO, {
            headers: { 
                'Authorization': `Bearer ${jwt}`
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