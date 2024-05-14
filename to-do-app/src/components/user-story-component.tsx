/**
 * The UserStoryComponent represents one user story of a feature in the 
 * project workflow. This is one thing the user can do within the 
 * project and is tied to a specific feature. It tracks the total number
 * tasks associated with it as well as the number of completed tasks.
 */
import React, { MouseEvent, useState, useEffect } from 'react';
import { 
    Box,
    Button,
    Flex,
    useDisclosure,
    useToast,
    Divider,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { StatusType, List, CreateTaskDTO } from '../types/types';
import { UpdateData } from '../api/calls';
import TaskComponent from '../components/task-component';

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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();
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
    }, [lists])
    
    //Keep the taskCount and completedCount updated.
    useEffect(() => {
        setTaskCount(tasks.length);
        setCompletedCount(tasks.reduce((count, task) => {
            return task.completed ? count + 1 : count;
        }, 0))
    }, [lists, tasks])
    
    //Add a task to this user story.
    const handleAddTask = async (event: MouseEvent<HTMLButtonElement>) => {
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
    
    return (
        <Flex bg='teal.500' padding='2px' mt='8px'>
            <Accordion allowToggle bg='white'  h='100%' w='100%'>
                <AccordionItem>
                    {({isExpanded}) => (
                        <>
                            <AccordionButton>
                                <Flex 
                                    w='100%' 
                                    mr='4px' 
                                    justify='space-between'
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
                            {isExpanded && <Divider border='1px' />}
                            <AccordionPanel padding={0}>
                                <Flex 
                                    h='100%' 
                                    flexDirection='column' 
                                    justify='space-between'
                                >
                                    <Flex flexGrow={1} flexDirection='column'>
                                        <Box>
                                            {description ?? 
                                                'Add a Description'
                                            }
                                        </Box>
                                        {tasks && tasks.length > 0 && tasks.map(
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
                                        )}
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
        </Flex>
    )
}

export default UserStoryComponent;