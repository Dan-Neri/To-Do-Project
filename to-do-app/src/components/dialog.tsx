/**
 * The Dialog component represents a pop-up or some container in the app
 * which can be used to display information. It grants the basic design
 * and functionality for modals and containers.
 */
import React, { ReactNode } from 'react';
import { 
    Box,
    Flex,
    CloseButton
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface DialogProps {
    w?: string;
    h?: string;
    title?: string | JSX.Element;
    bg?: string;
    exit?: () => void;
    align?: 'top' | 'center';
    header?: ReactNode | undefined;
    children?: ReactNode;
}

const Dialog = (props: DialogProps ) => {
    const { 
        w='500px',
        title='', 
        bg='tan',
        exit,
        align='top',
        header,
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
            padding='6px'
            bg='gray' 
            color='black'
            boxShadow='dark-lg'
        >
            <Flex
                w='100%'
                h='100%'
                bg={bg}
                flexDirection='column'
            >
                <Flex mt='1' h='12%'>
                    <Flex 
                        w='95%' 
                        fontSize='28' 
                        justifyContent='center' 
                        alignItems='center'
                        textAlign='center'
                    >
                        <>
                            {title}
                            {header && <Flex ml='4px'>{header}</Flex>}
                        </>
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