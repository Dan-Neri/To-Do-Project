import React from 'react';
import { Box, Button, Flex, HStack, VStack } from '@chakra-ui/react';
import { Outlet, Link, useLoaderData } from "react-router-dom";
import Dialog from '../components/dialog';

interface LoaderData {
    projects: string[];
};

export default function UserAccount() {
    const { projects } = useLoaderData() as LoaderData;
    
    return (
        <Flex h='100vh' justifyContent='center' alignItems='center'>
            <Dialog h='300px' align='center'>
                <VStack spacing='18px'>
                    <Box>
                        User's projects go here
                    </Box>
                    <HStack>
                        <Link to='/'>
                            <Button>
                                Go Home
                            </Button>
                        </Link>
                    </HStack>
                </VStack>
            </Dialog>
        </Flex>
    );
}

export async function loader(
    { request }: { request: Request }
): Promise<LoaderData> {
    const projects: string[] = [];
    return { projects };
}