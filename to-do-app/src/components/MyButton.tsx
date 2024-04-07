import React, { ReactNode } from 'react';
import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface ButtonProps {
    w?: string;
    h?: string;
    color?: string;
    text?: ReactNode;
    link?: string | Object;
    action?: () => void;
}

const MyButton = (props: ButtonProps ) => {
    const { w, h, color='blue', text='', link={}, action} = props;
    return (
        <Link to={link}>
            <Button
                w={w} 
                h={h}
                colorScheme={color}
                boxShadow='base'
                fontSize='14'
                onClick={action}
            >
                {text}
            </Button>
        </Link>
    )
}

export default MyButton;