/**
 * The Page component provides a basic design container for the majority
 * of pages within the app.
 */
import React, { ReactNode } from 'react';
import { 
    Box,
    Button,
    Flex,
    CloseButton,
    VStack,
    HStack
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

interface PageProps {
    w?: string;
    h?: string;
    bg?: string;
    title?: string;
    align?: string;
    justify?: string;
    children?: ReactNode;
}

const Page = (props: PageProps ) => {
    const { 
        w='95%', 
        h='95%', 
        bg='teal.100',
        title='',
        align='center',
        justify='center',
        children='' 
    } = props;
    const navigate = useNavigate();
    
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
                w={w}
                h={h}
                bg='tan'
                boxShadow='dark-lg'
            >
                <Flex 
                    w='97%' 
                    h='95%' 
                    bg={bg} 
                    flexDirection='column'
                    alignItems='center'
                    
                >
                    <Box fontSize='32'>
                        {title}
                    </Box>
                    <Flex
                        w='100%' 
                        h='100%' 
                        flex='1'
                        flexDirection='column' 
                        alignItems={align}
                        justifyContent={justify}
                    >
                        {children}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Page;