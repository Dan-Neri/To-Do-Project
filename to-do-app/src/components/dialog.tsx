/**
 * The Dialog component provides a standardized component which can be
 * reused to contain and display other elements on the page.
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

interface DialogProps {
    w?: string;
    h?: string;
    title?: string;
    exit?: () => void;
    align?: 'top' | 'center';
    children?: ReactNode;
}

const Dialog = (props: DialogProps ) => {
    const { 
        w='500px', 
        h='340px', 
        title='', 
        exit,
        align='top', 
        children='' 
    } = props;
    const navigate = useNavigate();
    
    function HandleClose() {
        exit? exit() : navigate('/');
    }
    
    return (
        <Flex
            justifyContent='center'
            alignItems='center'
            w={w} 
            h={h} 
            bg='gray' 
            color='black'
            boxShadow='lg'
        >
            <Flex
                w='95%'
                h='95%'
                bg='tan'
                flexDirection='column'
            >
                <Flex mt='1' h='12%'>
                    <Flex w='95%' fontSize='24' justifyContent='center'>
                        {title}
                    </Flex>
                    <Box justifyContent='right'>
                        <Flex padding='1'>
                            <CloseButton 
                                borderWidth='1px' 
                                borderColor='teal' 
                                size='sm'
                                onClick={HandleClose}
                            />
                        </Flex>
                    </Box>
                </Flex>
                <Flex 
                    h='90%' 
                    justifyContent='center' 
                    alignItems={align}
                    mt='2'
                >
                    {children}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Dialog;