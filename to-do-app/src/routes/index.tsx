import { Box, Flex, VStack, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function Index() {
    return (
        <Flex 
            textAlign='center' 
            h='100vh'
            color='black'
            justifyContent='center'
            padding='32px'
        >
            <Flex
                justifyContent='center'
                alignItems='center'
                w='95%'
                h='95%'
                bg='tan'
            >
                <Flex 
                    w='97%' 
                    h='95%' 
                    bg='teal.100' 
                    justifyContent='center' 
                    alignItems='center'
                    fontSize='32'
                >
                    <VStack>
                        <Box>
                            Welcome to Dan's Project Planner!
                        </Box>
                        <HStack>
                            <Link to='/sign-in'>
                                <Box _hover={{
                                    color: 'blue',
                                    textDecoration: 'underline'
                                }}>
                                    Sign-In
                                </Box>
                            </Link>
                            <Box>
                                or 
                            </Box>
                            <Link to='/sign-up'>
                                <Box _hover={{
                                    color: 'blue',
                                    textDecoration: 'underline'
                                }}>
                                    Create an Account
                                </Box>
                            </Link>
                        </HStack>
                    </VStack>
                </Flex>
            </Flex>
        </Flex>
    );
}