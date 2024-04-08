import React, { ReactNode } from 'react';
import { 
    Box,
    Button,
    Flex,
    CloseButton,
    VStack,
    HStack
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface DialogProps {
    w?: string;
    h?: string;
    title?: string
    align?: 'top' | 'center';
    children?: ReactNode;
}

const Dialog = (props: DialogProps ) => {
    const { 
        w='500px', 
        h='340px', 
        title='', 
        align='top', 
        children='' 
    } = props;
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
                <Flex h='12%'>
                    <Flex w='95%' fontSize='24' justifyContent='center'>
                        {title}
                    </Flex>
                    <Box justifyContent='right'>
                        <Link to='/'>
                            <Flex padding='1'>
                                <CloseButton 
                                    borderWidth='1px' 
                                    borderColor='teal' 
                                    size='sm'
                                />
                            </Flex>
                        </Link>
                    </Box>
                </Flex>
                <Flex 
                    h='90%' 
                    justifyContent='center' 
                    alignItems={align}
                >
                    {children}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Dialog;