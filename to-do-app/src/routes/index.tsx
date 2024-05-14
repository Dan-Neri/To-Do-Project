/**
 * The Index route is the default route displayed when the app is
 * started and provides a landing page for users.
 */
import { Box } from '@chakra-ui/react';
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

