/**
 * The FeatureComponent represents one feature in the project workflow,
 * something that can be accomplished within the project. It can be in 
 * any list and tracks the number of completed user stories as well as 
 * the total user stories contained within it.
 */
import React, { FormEvent, useState, useEffect } from 'react';
import { 
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
    IconButton
} from '@chakra-ui/react';
import { useNavigate, Form } from 'react-router-dom';
import Dialog from '../components/dialog';
import { StatusType, List, CreateUserStoryDTO } from '../types/types';
import { EditIcon } from '@chakra-ui/icons';
import { UpdateData } from '../api/calls';
import UserStoryComponent from '../components/user-story-component';

interface FeatureProps {
    id: string;
    projectID: string;
    listID: string;
    lists: List[];
    setLists: React.Dispatch<React.SetStateAction<List[]>>;
    w?: string;
    h?: string;
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
        w='20%', 
        h='10%',
        title='add a title',
        description='add a description'
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

    //Keep the list of user stories within this feature updated.
    useEffect(() => {
        const list = lists.find(list => list.id === listID);
        const feature = list? list.features.find(
            feature => feature.id === id
        ) : undefined;
        setUserStories(feature? feature.userStories : []);
    }, [lists])
    
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
    
    return (
        <Flex 
            w='100%'
            bg='teal.100'
            textIndent='4px'
            boxShadow='md'
            onClick={onOpen}
            _hover={{ bg: '#e8d9c4' }}
            cursor='pointer'
        >
            <Flex w='100%' mr='4px' justify='space-between'>
                <Flex>
                    {title}
                </Flex>
                <Flex>
                    {completedCount}/{storyCount}
                </Flex>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <Dialog 
                        title={title}
                        h='280px'
                        exit={onClose}
                        header={
                            <IconButton                                            
                                aria-label='Delete Project'
                                icon={<EditIcon />}
                                colorScheme='blackAlpha'
                                size='xs'
                             />
                        }
                    >
                        <ModalBody>
                            <Flex 
                                h='100%'
                                flexDirection='column' 
                                justifyContent='space-between'
                            >
                                Description:
                                <Flex 
                                    bg='white' 
                                    textIndent='4px' 
                                    flexGrow={1} 
                                    border='2px' 
                                    borderColor='teal.500'
                                >
                                    {description ?? 'Add a Description'}
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