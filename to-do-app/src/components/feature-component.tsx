/**
 * The FeatureComponent represents one feature in the project workflow,
 * something that can be accomplished within the project. It can be in 
 * any list and tracks the number of completed user stories as well as 
 * the total user stories contained within it.
 */
import React, { FormEvent, useState, useEffect, useRef } from 'react';
import { 
    Box,
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    useToast,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Editable,
    EditableInput,
    EditableTextarea,
    EditablePreview,
    Textarea
} from '@chakra-ui/react';
import { useNavigate, Form } from 'react-router-dom';
import Dialog from '../components/dialog';
import { StatusType, List, CreateUserStoryDTO } from '../types/types';
import { EditIcon } from '@chakra-ui/icons';
import { UpdateData } from '../api/calls';
import UserStoryComponent from '../components/user-story-component';
import { VscKebabVertical } from 'react-icons/vsc';
import EditableIcon from '../components/editable-icon';

interface FeatureProps {
    id: string;
    projectID: string;
    listID: string;
    lists: List[];
    setLists: React.Dispatch<React.SetStateAction<List[]>>;
    title?: string;
    description?: string;
}

const FeatureComponent = (props: FeatureProps) => {
    const { 
        id,
        projectID,
        listID,
        lists,
        setLists,
        title='Add a title',
        description='Add a description'
    } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { 
        isOpen: isStoryOpen, 
        onOpen: onStoryOpen, 
        onClose: onStoryClose 
    } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();
    //Find this specific feature.
    const list = lists.find(list => list.id === listID);
    const feature = list? list.features.find(
        feature => feature.id === id
    ) : undefined;
    /*Set a state variable to hold the list of user stories associated 
    with this feature.*/
    const [userStories, setUserStories] = useState(
        feature? feature.userStories : []
    );
    //Track the total number of user stories in this feature.
    const [storyCount, setStoryCount] = useState(userStories.length);
    //Track the number of completed user stories in this feature.
    const [completedCount, setCompletedCount] = useState(() => {
        return userStories.reduce((count, userStory) => {
            const completed = userStory.tasks.length > 0? (
                userStory.tasks.every(task => task.completed)
            ) : (false);
            return completed ? count + 1 : count;
        }, 0);
    })
    const initialRef = useRef(null);

    //Keep the list of user stories within this feature updated.
    useEffect(() => {
        const list = lists.find(list => list.id === listID);
        const feature = list? list.features.find(
            feature => feature.id === id
        ) : undefined;
        setUserStories(feature? feature.userStories : []);
    }, [lists, id, listID])
    
    //Keep the storyCount and completedCount updated.
    useEffect(() => {
        setStoryCount(userStories.length);
        setCompletedCount(userStories.reduce((count, userStory) => {
            const completed = userStory.tasks.length > 0? (
                userStory.tasks.every(task => task.completed)
            ) : (false);
            return completed ? count + 1 : count;
        }, 0));
    }, [lists, userStories])
    
    //Add a user story to this feature.
    const handleAddUserStory = async (event: FormEvent<HTMLFormElement>) => {
        /*Prevent the form from sending a traditional POST request when
        submitted which would refresh the page needlessly*/
        event.preventDefault();
        //Pull the user story data from the form.
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const storyTitle = formData.get('title') as string;
        const storyDescription = formData.get('description');
        //Create an object with the new user story data.
        const DTO: CreateUserStoryDTO = {
            projectID: projectID,
            listID: listID,
            featureID: id,
            title: storyTitle,
            description: storyDescription as string ?? undefined
        }
        try {
            //Send a POST request to the back-end API to create the user story.
            const response = await UpdateData(
                    `/user-stories/create`,
                    DTO
            );
            if (response) {
                /*Find a path to this specific feature from the main lists 
                state.*/
                const listIndex = lists.findIndex(list => list.id === listID);
                const featureIndex = listIndex > -1? (
                    lists[listIndex].features.findIndex(
                        feature => feature.id === id
                    )
                ) : (
                    -1
                );
                //Throw an error if the feature is not found.
                if (featureIndex === -1) {
                    toast({
                        title: 'Error',
                        description: 'Unable to find feature',
                        status: 'error' as StatusType,
                        duration: 4000,
                        isClosable: true
                    });
                }
                //Create a copy of the entire lists state.
                const newLists = lists.slice();
                /*Update the list of user stories for this specific 
                feature with the new user story added.*/
                newLists[
                    listIndex
                ].features[
                    featureIndex
                ].userStories = response.data;
                setLists(newLists);
            }
        } catch (error: any) {
            if(error.response) {
                toast({
                    title: 'Error',
                    description: error.response.data.message,
                    status: 'error' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
                if(error.response.data.message.includes('Authorization')) {
                    navigate('/sign-in')
                    return;
                }
            } else {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
            }
            if(error.message.includes('Authorization')) {
                navigate('/sign-in');
                return;
            }
        }
    }
    
    //Update the Feature title.
    const handleEditTitle = (nextValue: string) => {
        const currentValue = title ?? 'Add a title';
        if (nextValue !== currentValue) {
            toast({
                title: 'Update Feature Title',
                description: `Change the Feature title from ${currentValue} to ${nextValue}`,
                status: 'info' as StatusType,
                duration: 4000,
                isClosable: true
            });
        }
    }
    
    //Update the Feature description.
    const handleEditDescription = (nextValue: string) => {
        const currentValue = description ?? 'Add a description';
        if (nextValue !== currentValue) {
            toast({
                title: 'Update Feature description',
                description: `Change the Feature description from ${currentValue} to ${nextValue}`,
                status: 'info' as StatusType,
                duration: 4000,
                isClosable: true
            });
        }
    }
    
    //Delete the feature along with all associated user stories and tasks.
    const handleDelete = () => {
        toast({
            title: 'Delete Feature',
            description: `Display delete Feature confirmation Modal`,
            status: 'info' as StatusType,
            duration: 4000,
            isClosable: true
        });
    }
    
    return (
        <Flex 
            w='100%'
            textIndent='4px'
            boxShadow='md'
            cursor='pointer'
            bg='teal.100'
            _hover={{ bg: '#e8d9c4' }}
            onClick={onOpen}
        >
            <Flex w='100%' mr='4px' justify='space-between'>
                <Flex>
                    {title}
                </Flex>
                <Flex>
                    <Flex mr='4px'>
                        {completedCount}/{storyCount}
                    </Flex>
                    <Menu>
                        <MenuButton 
                            as={IconButton} 
                            aria-label='Feature Settings'
                            icon={
                                <Box w='10px' h='16px' mr='4px'>
                                    <VscKebabVertical size='100%'/>
                                </Box>
                            }
                            bg=''
                            _hover={{ bg: '' }}
                            _active={{ bg: '' }}
                            size='xs'
                            mr='2px'
                            onClick={(e) => e.stopPropagation()}
                        >
                            Actions
                        </MenuButton>
                        <MenuList>
                            {/*<MenuItem 
                                _hover= {{ bg: '#e8d9c4' }} 
                                _focus= {{ bg: '#e8d9c4' }} 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleEditTitle();
                                }}
                            >
                                Edit Title
                            </MenuItem>*/}
                            <MenuItem 
                                _hover= {{ bg: '#e8d9c4' }} 
                                _focus= {{ bg: '#e8d9c4' }} 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleDelete();
                                }}
                            >
                                Delete
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
            <Modal 
                isOpen={isOpen} 
                onClose={onClose}
                initialFocusRef={initialRef}
            >
                <ModalOverlay />
                <ModalContent>
                    <Dialog
                        title={
                            <Editable 
                                defaultValue={title}
                                onSubmit={handleEditTitle}
                            >
                                <EditablePreview mr='4px' cursor='pointer' />
                                <EditableInput bg='white' autoFocus={false} />
                                <EditableIcon ariaLabel='Edit Feature Title'/>
                            </Editable>
                        }
                        h='280px'
                        exit={onClose}
                    >
                        <ModalBody>
                            {/*Gain focus when the modal opens and prevent The
                            title from starting in edit mode*/}
                            <div 
                                ref={initialRef} 
                                tabIndex={-1} 
                                aria-hidden="true"
                            />
                            <Flex 
                                h='100%'
                                flexDirection='column' 
                                justifyContent='space-between'
                            >
                                Description:
                                <Flex
                                    w='100%'
                                    bg='white'
                                    border='2px' 
                                    borderColor='teal.500'
                                    borderRadius='md'
                                >
                                    <Editable 
                                        w='100%'
                                        h='100%'
                                        defaultValue={
                                            description || 'Add a description'
                                        } 
                                        onSubmit={handleEditDescription}
                                    >
                                        <EditablePreview 
                                            ml='4px' 
                                            mr='4px' 
                                            cursor='pointer'
                                        />
                                        <Textarea
                                            size='lg'
                                            maxW='100%'
                                            bg='white' 
                                            padding='4px'
                                            resize='none'
                                            border='none'
                                            as={EditableTextarea}
                                        />
                                        <EditableIcon 
                                            ariaLabel='Edit Feature Description'
                                        />
                                    </Editable>
                                </Flex>
                                {userStories && userStories.length > 0 && 
                                    userStories.map((userStory, index) => (
                                        <UserStoryComponent 
                                            key={userStory.id}
                                            id={userStory.id}
                                            projectID={projectID}
                                            listID={listID}
                                            featureID={id}
                                            lists={lists}
                                            setLists={setLists}
                                            title={userStory.title}
                                            description={userStory.description}
                                        />
                                    ))
                                }
                                <Button 
                                    onClick={onStoryOpen} 
                                    mt='8px' 
                                    border='2px' 
                                    borderColor='teal.500'
                                >
                                    Add User Story
                                </Button>
                            </Flex>
                        </ModalBody>
                    </Dialog>
                </ModalContent>
            </Modal>
            <Modal size='xs' isOpen={isStoryOpen} onClose={onStoryClose}>
                <ModalOverlay />
                <ModalContent mt='5%'>
                    <Dialog
                        w='100%'
                        title='Add a User Story'
                        exit={onStoryClose}
                    >
                        <ModalBody>
                            <Flex 
                                h='100%'
                                flexDirection='column' 
                                justifyContent='space-between'
                            >
                                <Form onSubmit={(event) => { 
                                    handleAddUserStory(event); 
                                    onStoryClose();
                                }}>
                                    <FormControl isRequired>
                                        <FormLabel>
                                            Title:
                                        </FormLabel>
                                        <Input 
                                            name='title' 
                                            bg='white' 
                                            placeholder='Please enter a title' 
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>
                                            Description:
                                        </FormLabel>
                                        <Input name='description' bg='white' />
                                    </FormControl>
                                    <Button mt='8px' type='submit'>
                                        Create User Story
                                    </Button>
                                </Form>
                            </Flex>
                        </ModalBody>
                    </Dialog>
                </ModalContent>
            </Modal>
        </Flex>
    )
}

export default FeatureComponent;