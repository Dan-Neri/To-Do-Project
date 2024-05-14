/**
 * The UserAccount route allows a user to view and update their account 
 * information.
 */
import { useState, ChangeEvent } from 'react';
import { 
    Button, 
    Flex, 
    HStack, 
    useToast,
    Input,
    FormControl,
    FormLabel,
    Tooltip,
    createStandaloneToast
} from '@chakra-ui/react';
import { Form, useLoaderData, redirect } from "react-router-dom";
import Page from '../components/page';
import { FetchData, UpdateData } from '../api/calls';
import { StatusType, UpdateUserDTO } from '../types/types';

interface LoaderData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}

export default function UserAccount() {
    //Get data from the loader function.
    const loader = useLoaderData() as LoaderData;
    //Track the contents of the password field.
    const [ password, setPassword ] = useState('');
    //Track the contents of the confirm password field.
    const [ confirmPass, setConfirmPass ] = useState('');
    //Track if the password and confirm password fields match.
    const [ passMatch, setPassMatch ] = useState(true);
    const toast = useToast();
    
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
                    method='post' 
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
                                placeholder={loader.firstName}
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
                                placeholder={loader.lastName}
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
                                placeholder={loader.username}
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
                                placeholder={loader.email}
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

/*Fetch the user's data by making a request to the back-end API.
Redirect to the sign in page if authorization is invalid.*/
export async function loader(): Promise<LoaderData | Response> {
    /*Create a toast container which can be displayed outside of our 
    react component.*/
    const { toast } = createStandaloneToast();
    try {
        //Send a request to the API to get the user's account data.
        const response = await FetchData('/users/account');
        //Authorization is valid.
        if (response) {
            //return user's data.
            return response.data;
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
    }
    //Authorization is invalid.
    return redirect('/sign-in');
}

/*Send updated user data to the back end so that it can be changed in
the database.*/
export async function action({ request }: { request: Request}) {
    const formData = await request.formData();
    const { toast } = createStandaloneToast();
    let response;
    //Create an empty DTO to hold any data to be updated.
    let DTO: UpdateUserDTO = {};
    //Check each field for updated data and store it in the DTO if found.
    formData.forEach((value, key) => {
        if ((typeof value === 'string') && (value.trim() !== '')) {
            DTO[key] = value;
        }
    });
    
    //Check to make sure there is data to update.
    if (Object.values(DTO).some(value => value)) {
        try {
            //Send a request to the API with the data to update in the body.
            const response = await UpdateData(
                '/users/update',  
                DTO
            );
            if (response) {
                toast({
                    title: 'Success',
                    description: 'Your information has been updated.',
                    status: 'success' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
                return redirect('/account');
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
                return redirect('/sign-in');
            }
        }
    }
}