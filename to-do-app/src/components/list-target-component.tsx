/**
 * The ListTargetComponent represents a valid location for a list to be
 * dropped and facilitates the rearranging of lists within the projectID
 * workflow.
 */
import { Flex } from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';
import { 
    dropTargetForElements 
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

type HoveredState = 'idle' | 'validMove' | 'invalidMove';

interface ListTargetProps {
    index: number
}

const ListTargetComponent = (props: ListTargetProps) => {
    const { index } = props;
    const targetRef = useRef(null);
    const [dragState, setDragState] = useState<HoveredState>('idle');
    
    useEffect(() => {
        const targetElement = targetRef.current;
        if (!targetElement) {
            return;
        }
        return dropTargetForElements({
            element: targetElement,
            getData: () => ({ index }),
            onDragEnter: ({ source }) => {
                if (canMove(source.data.listIndex as number)) {
                    setDragState('validMove');
                }
                else {
                    setDragState('invalidMove');
                }
            },
            canDrop: ({ source }) => {
                return canMove(source.data.listIndex as number);
            },
            onDragLeave: () => setDragState('idle'),
            onDrop: () => setDragState('idle')
        })
    }, [index])
    
    const canMove = (listIndex: number) => {
        return (
            listIndex === index || listIndex === index - 1
        ) ? false : true; 
    }
    
    return (
        <Flex 
            w='8px'
            h='100%'
            mt='4px' 
            ml='4px' 
            justify='center'
            ref={targetRef}
        >
            <Flex
                h='96px' 
                border='1px' 
                borderColor='red'
                opacity={dragState === 'validMove' ? 1: 0}
            />
        </Flex>
    )
}

export default ListTargetComponent;
