/**
 * The UserStoryComponent represents one user story of a feature in the 
 * project workflow. This is one thing the user can do within the 
 * project and is tied to a specific feature. It tracks the total number
 * tasks associated with it as well as the number of completed tasks.
 */
import React, { PointerEvent, useState, useEffect, FormEvent } from 'react';
import { 
    Box,
    Button,
    Flex,
    HStack,
    useToast,
    Divider,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Editable,
    EditableInput,
    EditablePreview,
    Input,
    FormControl,
    FormLabel
} from '@chakra-ui/react';
import { useNavigate, Form } from 'react-router-dom';
import { 
    StatusType, 
    List, 
    CreateTaskDTO, 
    UpdateUserStoryDTO 
} from '../types/types';
import { UpdateData } from '../api/calls';
import TaskComponent from '../components/task-component';
import { VscKebabVertical } from 'react-icons/vsc';
import Dialog from '../components/dialog';

interface UserStoryProps {
    id: string;
    projectID: string;
    listID: string;
    featureID: string;
    lists: List[];
    setLists: React.Dispatch<React.SetStateAction<List[]>>;
    title: string;
    description?: string;
}

const UserStoryComponent = (props: UserStoryProps) => {
    const {    
        id,
        projectID,
        listID,
        featureID,
        lists,
        setLists,
        title,
        description
    } = props;
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { 
        isOpen: isEditOpen, 
        onOpen: onEditOpen, 
        onClose: onEditClose 
    } = useDisclosure();
    //Find this specific user story.
    const list = lists.find(list => list.id === listID);
    const feature = list? list.features.find(
        feature => feature.id === featureID
    ) : undefined;
    const userStory = feature? feature.userStories.find(
        userStory => userStory.id === id
    ) : undefined;
    /*Set a state variable to hold the list of tasks associated with 
    this user story.*/
    const [tasks, setTasks] = useState(userStory? userStory.tasks : []);
    //Track the total number of tasks in this user story.
    const [taskCount, setTaskCount] = useState(tasks.length);
    //Track the number of completed tasks in this user story.
    const [completedCount, setCompletedCount] = useState(
        tasks.reduce((count, task) => {
            return task.completed ? count + 1 : count;
        }, 0)
    );

    //Keep the list of tasks within this user story updated.
    useEffect(() => {
        const list = lists.find(list => list.id === listID);
        const feature = list? list.features.find(
            feature => feature.id === featureID
        ) : undefined;
        const userStory = feature? feature.userStories.find(
            userStory => userStory.id === id
        ) : undefined;
        setTasks(userStory? userStory.tasks : []);
    }, [lists, id, listID, featureID])
    
    //Keep the taskCount and completedCount updated.
    useEffect(() => {
        setTaskCount(tasks.length);
        setCompletedCount(tasks.reduce((count, task) => {
            return task.completed ? count + 1 : count;
        }, 0))
    }, [lists, tasks])
    
    //Add a task to this user story.
    const handleAddTask = async (event: PointerEvent<HTMLButtonElement>) => {
        //Create an object with filler data for the new task.
        const DTO: CreateTaskDTO= {
            projectID: projectID,
            listID: listID,
            featureID: featureID,
            userStoryID: id,
            content: 'New Task'
        }
        try {
            //Send a POST request to the back-end API to create the task.
            const response = await UpdateData(
                    `/tasks/create`,
                    DTO
            );
            if (response) {
                /*Find a path to this specific user story from the main lists 
                state.*/
                const listIndex = lists.findIndex(list => list.id === listID);
                const featureIndex = listIndex > -1? (
                    lists[listIndex].features.findIndex(
                        feature => feature.id === featureID
                    )
                ) : (
                    -1
                );
                const storyIndex = featureIndex > -1? (
                    lists[
                        listIndex
                    ].features[
                        featureIndex
                    ].userStories.findIndex(
                        userStory => userStory.id === id
                    )
                ) : (
                    -1
                );
                //Throw an error if the user story is not found.
                if (storyIndex === -1) {
                    toast({
                        title: 'Error',
                        description: 'Unable to find user story',
                        status: 'error' as StatusType,
                        duration: 4000,
                        isClosable: true
                    });
                }
                //Create a copy of the entire lists state.
                const newLists = lists.slice();
                /*Update the list of tasks for this specific user story
                with the new task added.*/
                newLists[
                    listIndex
                ].features[
                    featureIndex
                ].userStories[
                    storyIndex
                ].tasks = response.data;
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
    
    //Edit the User Story title and description.
    const handleEdit = (event: FormEvent<HTMLFormElement>) => {
        /*Prevent the form from sending a traditional POST request when
        submitted which would refresh the page needlessly*/
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const newTitle = formData.get('title') as string;
        const updateTitle = (newTitle === title) ? false : true; 
        const newDescription = formData.get('description');
        const currentDescription = description ?? 'Add a Description';
        const updateDescription = (
            newDescription === currentDescription
        ) ? false : true; 
        if (
            (newTitle && updateTitle) || (newDescription && updateDescription)
        ) {
            //Create an object with the new user story data.
            const DTO: UpdateUserStoryDTO = {
                projectID: projectID,
                listID: listID,
                featureID: featureID,
                id: id,
                title: updateTitle ? newTitle as string : undefined,
                description: (
                    updateDescription ? newDescription as string : undefined
                )
            };
            const message = (
                'Update User Story ' + 
                (updateTitle ? `title from ${title} to ${newTitle}` : '') + 
                (updateTitle && updateDescription ? ' and ' : '') +
                (
                    newDescription ? (
                        `description from ${description} to ${newDescription}` 
                    ): (''
                    )
                )
            )
            toast({
                title: 'Edit User Story',
                description: message,
                status: 'info' as StatusType,
                duration: 4000,
                isClosable: true
            });
        }
    }
    
    //Delete the User Story and any associated Tasks.
    const handleDelete = () => {
        toast({
            title: 'Delete User Story',
            description: `Display delete User Story confirmation Modal`,
            status: 'info' as StatusType,
            duration: 4000,
            isClosable: true
        });
    }
    
    return (
        <Flex bg='teal.500' padding='2px' mt='8px'>
            <Accordion allowToggle bg='white' h='100%' w='100%'>
                <AccordionItem>
                    {({isExpanded}) => (
                        <>
                            <Flex align='center'>
                                <AccordionButton style={{ flexGrow: 1 }}>
                                    <Flex 
                                        w='100%' 
                                        mr='4px' 
                                        justify='space-between'
                                        alignItems='center'
                                    >
                                        <Flex>
                                            {title}
                                        </Flex>
                                        <Flex>
                                            {completedCount}/{taskCount}
                                        </Flex>
                                    </Flex>
                                    <AccordionIcon />
                                </AccordionButton>
                                <Menu>
                                    <MenuButton 
                                        as={IconButton} 
                                        aria-label='User Story Settings'
                                        icon={
                                            <Box w='10px' h='16px' mr='4px'>
                                                <VscKebabVertical size='100%'/>
                                            </Box>
                                        }
                                        bg='white'
                                        _hover={{ bg: '' }}
                                        _active={{ bg: '' }}
                                        size='xs'
                                        mr='4px'
                                        h='100%'
                                    >
                                        Actions
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem 
                                            _hover= {{ bg: '#e8d9c4' }}
                                            _focus= {{ bg: '#e8d9c4' }}
                                            onClick={onEditOpen}
                                        >
                                            Edit
                                        </MenuItem>
                                        <MenuItem 
                                            _hover= {{ bg: '#e8d9c4' }} 
                                            _focus= {{ bg: '#e8d9c4' }}
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Flex>
                            {isExpanded && <Divider border='1px' />}
                            <AccordionPanel padding={0}>
                                <Flex 
                                    h='100%' 
                                    flexDirection='column' 
                                    justify='space-between'
                                >
                                    <Flex 
                                        ml='16px'
                                        mr='16px'
                                        mb='8px'
                                        flexGrow={1} 
                                        flexDirection='column'
                                    >
                                        {description || 'Add a Description'}
                                        {tasks && tasks.length > 0 && 
                                            tasks.map(
                                                (task, index) => (
                                                    <TaskComponent 
                                                        key={task.id}
                                                        id={task.id}
                                                        projectID={projectID}
                                                        listID={listID}
                                                        featureID={featureID}
                                                        userStoryID={id}
                                                        lists={lists}
                                                        setLists={setLists}
                                                    />
                                                )
                                            )
                                        }
                                    </Flex>
                                    <Divider border='1px'/>
                                    <Button 
                                        borderRadius={0} 
                                        onClick={handleAddTask}
                                    >
                                        Add a Task
                                    </Button>
                                </Flex>
                            </AccordionPanel>
                        </>
                    )}
                </AccordionItem>
            </Accordion>
            <Modal size='xl' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent mt='5%' maxW='650px'>
                    <Dialog
                        w='100%'
                        title={
                            <div style={{ 
                                width: '600px',
                                background: 'white',
                                border: '1px solid teal',
                                marginLeft: '4px'
                            }}>
                                {'Are you sure you want to delete this user '}
                                {'story:'}
                                <br />
                                {`"${title}"`}
                            </div>
                        }
                        exit={onClose}
                    >
                        <ModalBody p='0' ml='4px' mr='32px'>
                            <Flex 
                                h='100%'
                                flexDirection='column' 
                                align='center'
                                justifyContent='space-between'
                            >
                                <Box 
                                    w='500px' 
                                    ml='8px' 
                                    border='1px' 
                                    bg='white' 
                                    textAlign='center' 
                                    textColor='red'
                                    fontSize='14px'
                                    fontWeight='bold'
                                >
                                    This will also delete all tasks associated 
                                    with this user story. <br /> This cannot be 
                                    undone!
                                </Box>
                                <HStack mt='8px' mb='8px' justify='center'>
                                    <Button 
                                        colorScheme='red' 
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>
                                    <Button>
                                        Cancel
                                    </Button>
                                </HStack>
                            </Flex>
                        </ModalBody>
                    </Dialog>
                </ModalContent>
            </Modal>
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
                <ModalOverlay />
                <ModalContent mt='5%'>
                    <Dialog
                        w='100%'
                        title={`Edit User Story: ${title}`}
                        exit={onEditClose}
                    >
                        <ModalBody>
                            <Flex 
                                h='100%'
                                flexDirection='column' 
                                justifyContent='space-between'
                            >
                                <Form onSubmit={(event) => { 
                                    handleEdit(event); 
                                    onEditClose();
                                }}>
                                    <FormControl>
                                        <FormLabel>
                                            Title:
                                        </FormLabel>
                                        <Input 
                                            name='title' 
                                            bg='white' 
                                            placeholder={title} 
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>
                                            Description:
                                        </FormLabel>
                                        <Input 
                                            name='description' 
                                            bg='white' 
                                            placeholder={description}
                                        />
                                    </FormControl>
                                    <HStack mt='8px' justifyContent='center'>
                                        <Button 
                                            type='submit' 
                                            colorScheme='blue'
                                        >
                                            Update
                                        </Button>
                                        <Button onClick={onEditClose}>
                                            Cancel
                                        </Button>
                                    </HStack>
                                </Form>
                            </Flex>
                        </ModalBody>
                    </Dialog>
                </ModalContent>
            </Modal>
        </Flex>
    )
}

export default UserStoryComponent;