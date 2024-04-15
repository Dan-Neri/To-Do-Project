/**
 * The Index route is the default route displayed when the app is
 * started and provides a landing page for users.
 */
import { Box, Flex, VStack, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Page from '../components/page';

export default function Index() {
    
    return (
        <Page>
            <Box fontSize='32'>
                Welcome to Dan's Project Planner!
            </Box>
        </Page>
    );
}

